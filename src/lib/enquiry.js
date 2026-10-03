import { loadConfig } from './config'

/**
 * Where an enquiry actually goes.
 *
 * This is a static site — there is no server of our own to POST to — so the
 * destination is a deployment choice, not a code one. The destination is read
 * at runtime from `public/config.json`, which the client edits directly on the
 * server after handover; no rebuild, no CLI. See src/lib/config.js.
 *
 * Supported providers:
 *
 *   sheets     Google Apps Script → Google Sheet. Free, no third-party vendor,
 *              data stays in the client's own Drive.
 *              Setup: scripts/google-apps-script.gs
 *   formspree  Hosted form backend with email notifications.
 *   web3forms  Similar, access-key based, no account needed to start.
 *   endpoint   Any JSON API you control. POSTs the payload as-is.
 *   none       (default) No backend. Falls back to the visitor's mail client.
 *
 * Whatever the transport, two rules hold:
 *
 *   1. We never report success for a message that was not accepted.
 *   2. A failed send is never silently dropped — it is kept locally and the
 *      user is given the mailto route so the enquiry is not lost.
 */

/** Submissions that failed to send, so a network blip never loses an enquiry. */
const PENDING_KEY = 'futr:pending-enquiries'

/**
 * How long a failed enquiry is kept on the visitor's device.
 *
 * These records are the full enquiry — name, email, phone, message — sitting
 * in localStorage, which is readable by any script on this origin and survives
 * browser restarts indefinitely. Keeping them forever turns a convenience
 * (don't lose the message on a flaky connection) into a standing cache of
 * personal data on a machine that may well be shared.
 *
 * A week is long past the point where anyone is still going to retry, and
 * short enough that an abandoned enquiry does not sit on a borrowed laptop for
 * a year.
 */
const PENDING_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** Cap on stored failures, so a backend outage cannot fill the quota. */
const PENDING_MAX = 20

const TIMEOUT_MS = 15000

/**
 * Whether a configured endpoint is safe to POST an enquiry to.
 *
 * The endpoint is read at runtime from a file the client edits by hand after
 * handover, so unlike the rest of the bundle it is not something we reviewed.
 * A typo that drops the `s` from `https` would put every name, email address
 * and phone number on the wire in clear text, and a pasted `javascript:` or
 * `data:` URL would be worse. Only absolute HTTPS survives; everything else is
 * treated as "no backend configured", which lands the visitor on the mailto
 * fallback instead of a silent failure.
 */
export function isSafeEndpoint(url) {
  if (typeof url !== 'string' || !url.trim()) return false
  try {
    // `window.location.origin` as the base is irrelevant for an absolute URL
    // and makes a relative one resolve rather than throw — which is then
    // rejected below for not being an absolute https:// string.
    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : undefined)
    if (parsed.protocol !== 'https:') return false
    // Reject anything that was not written as an absolute URL to begin with,
    // so a stray "//evil.test/collect" or a bare path is not accepted on the
    // strength of the page's own scheme.
    return /^https:\/\//i.test(url.trim())
  } catch {
    return false
  }
}

/* ── Transports ───────────────────────────────────────────────────────────
   Each returns a Response-like outcome or throws. They differ only in the
   shape the provider expects. */

const transports = {
  /**
   * Google Apps Script web app bound to a Sheet.
   *
   * Apps Script does not return CORS headers on a normal POST, so this uses a
   * text/plain content type — which the browser treats as a "simple" request
   * and sends without a preflight. The script parses the body as JSON.
   */
  async sheets(payload, { endpoint }) {
    const res = await post(endpoint, JSON.stringify(payload), 'text/plain;charset=utf-8')
    if (!res.ok) throw new Error(`Sheets HTTP ${res.status}`)
    return 'sheets'
  },

  async formspree(payload, { endpoint }) {
    const res = await post(endpoint, JSON.stringify(payload), 'application/json', {
      Accept: 'application/json',
    })
    if (!res.ok) throw new Error(`Formspree HTTP ${res.status}`)
    return 'formspree'
  },

  async web3forms(payload, { accessKey }) {
    const res = await post(
      'https://api.web3forms.com/submit',
      JSON.stringify({ access_key: accessKey, ...payload }),
      'application/json',
      { Accept: 'application/json' }
    )
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.success === false) throw new Error(json.message || `Web3Forms HTTP ${res.status}`)
    return 'web3forms'
  },

  async endpoint(payload, { endpoint }) {
    const res = await post(endpoint, JSON.stringify(payload), 'application/json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return 'endpoint'
  },
}

async function post(url, body, contentType, extraHeaders = {}) {
  // Belt and braces. `hasBackend` already refused anything that is not
  // absolute HTTPS, but this is the single function every transport funnels
  // through, so the invariant is cheapest to guarantee here — a future
  // transport added above cannot forget to check.
  if (!isSafeEndpoint(url)) throw new Error('Refusing to post to a non-HTTPS endpoint')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': contentType, ...extraHeaders },
      body,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

/* ── Local keep ───────────────────────────────────────────────────────── */

/** Drops anything past its retention window. Shared by read and write. */
function withinTtl(entries) {
  const cutoff = Date.now() - PENDING_TTL_MS
  return entries.filter((entry) => {
    const at = Date.parse(entry?._failedAt ?? '')
    // An entry with no readable timestamp predates this field, or was
    // tampered with. Either way it has no provable age, so it goes.
    return Number.isFinite(at) && at >= cutoff
  })
}

function readPending() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function keepLocally(payload, reason) {
  try {
    const existing = withinTtl(readPending())
    existing.push({ ...payload, _failedAt: new Date().toISOString(), _reason: reason })
    localStorage.setItem(PENDING_KEY, JSON.stringify(existing.slice(-PENDING_MAX)))
  } catch {
    // Private mode / quota. Nothing more we can do client-side.
  }
}

/**
 * Enquiries that never reached a backend. Exposed for support and for tests.
 *
 * Expired entries are not just filtered from the result — they are deleted on
 * the way past, so the retention window is enforced by anyone reading rather
 * than relying on a later failure to trigger a rewrite.
 */
export function pendingEnquiries() {
  const stored = readPending()
  const live = withinTtl(stored)

  if (live.length !== stored.length) {
    try {
      if (live.length) localStorage.setItem(PENDING_KEY, JSON.stringify(live))
      else localStorage.removeItem(PENDING_KEY)
    } catch {
      /* ignore */
    }
  }

  return live
}

export function clearPendingEnquiries() {
  try {
    localStorage.removeItem(PENDING_KEY)
  } catch {
    /* ignore */
  }
}

/* ── Mailto fallback ──────────────────────────────────────────────────── */

export function buildMailto(payload, to) {
  const body = [
    `User type: ${payload.userType}`,
    `Name: ${payload.name}`,
    payload.company && `Company: ${payload.company}`,
    `Email: ${payload.email}`,
    payload.phone && `Phone: ${payload.phone}`,
    '',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n')

  return `mailto:${to}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`
}

/* ── Public API ───────────────────────────────────────────────────────── */

/**
 * Whether a backend is configured. Async because the answer lives in a file
 * the client edits, not in the bundle.
 */
export async function hasBackend() {
  const { contact } = await loadConfig()
  if (contact.provider === 'none' || !transports[contact.provider]) return false

  // A provider with nothing to post to is a misconfiguration, not a backend.
  // Treat it as absent so the user still gets the mailto route rather than a
  // request to an empty URL.
  if (contact.provider === 'web3forms') return Boolean(contact.accessKey)

  // Same for an endpoint we would not be willing to send personal data to.
  // `isSafeEndpoint` logs the reason; here it just means "no backend", which
  // routes the visitor to mailto rather than dropping their enquiry.
  if (!isSafeEndpoint(contact.endpoint)) {
    if (contact.endpoint) {
      console.error(
        `[futr] Contact endpoint rejected — it must be an absolute https:// URL. Got: ${contact.endpoint}`
      )
    }
    return false
  }

  return true
}

/**
 * @returns {Promise<{ ok: boolean, via: string, error?: string }>}
 *   via is 'sheets' | 'formspree' | 'web3forms' | 'endpoint' | 'mailto' | 'failed'
 */
export async function submitEnquiry(values, userType) {
  const payload = {
    ...values,
    userType,
    submittedAt: new Date().toISOString(),
    source: typeof window !== 'undefined' ? window.location.pathname : '/talk',
  }

  const { contact } = await loadConfig()

  if (!(await hasBackend())) {
    return { ok: false, via: 'mailto', payload }
  }

  try {
    const via = await transports[contact.provider](payload, contact)
    return { ok: true, via, payload }
  } catch (error) {
    // Hold onto it rather than pretending it sent.
    keepLocally(payload, error.message)
    return { ok: false, via: 'failed', error: error.message, payload }
  }
}
