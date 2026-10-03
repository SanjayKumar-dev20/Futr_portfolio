/**
 * What a valid enquiry is.
 *
 * Split out of the store on purpose. The store owns *the state of the form* —
 * which fields have been touched, what the submit status is. This owns *the
 * shape of the data*, which three other places need to agree with:
 *
 *   · src/stores/contact.js  validates against it before submitting
 *   · src/pages/Talk          renders `maxLength` from it
 *   · scripts/google-apps-script.gs  re-enforces it server-side
 *
 * Before this existed, the only cap on any field was the server's `trim()`,
 * and the UI advertised no limit at all — so a browser would happily let
 * someone paste a megabyte into "Message", spend a second serialising it, and
 * have the backend silently cut it to 5 000 characters with no indication that
 * most of what they wrote was gone. A scripted client could post far more than
 * that, repeatedly, which is a cheap way to fill someone's Drive.
 *
 * The limits are deliberately generous for a human and obviously hostile to a
 * payload. They are enforced in three places because the first two can be
 * bypassed by anyone willing to use curl, and the third cannot.
 */

/** Per-field maximum length, in characters. Mirrored in the Apps Script. */
export const LIMITS = Object.freeze({
  name: 120,
  company: 160,
  email: 254, // RFC 5321 maximum for a complete address
  phone: 40,
  subject: 200,
  message: 4000,
})

/** Short enough to be a mistake, not a message. */
export const MESSAGE_MIN = 12

/**
 * Deliberately permissive. Real addresses defeat stricter regexes far more
 * often than fake ones defeat this one, and the only thing a tighter pattern
 * would buy is rejecting people with unusual but valid addresses.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const tooLong = (value, max) =>
  value && value.trim().length > max ? `Please keep this under ${max} characters.` : null

/**
 * One rule per field. Adding a field means adding a line here — the component,
 * the blur handler and the submit path all pick it up without changes.
 *
 * Every rule returns a message a person can act on, or null.
 */
export const RULES = Object.freeze({
  name: (v) => {
    if (!v?.trim()) return 'Please tell us your name.'
    return tooLong(v, LIMITS.name)
  },
  company: (v) => tooLong(v, LIMITS.company),
  email: (v) => {
    if (!v?.trim()) return 'We need an email to reply to.'
    if (!EMAIL.test(v.trim())) return "That email doesn't look right."
    return tooLong(v, LIMITS.email)
  },
  phone: (v) => tooLong(v, LIMITS.phone),
  subject: (v) => {
    if (!v?.trim()) return 'A subject helps us route this.'
    return tooLong(v, LIMITS.subject)
  },
  message: (v) => {
    if (!v?.trim()) return 'Tell us what you need.'
    if (v.trim().length < MESSAGE_MIN) return 'A little more detail, please.'
    return tooLong(v, LIMITS.message)
  },
})

/** Fields that must be filled in. Drives the `*` in the UI. */
export const REQUIRED = Object.freeze(['name', 'email', 'subject', 'message'])

/** @returns {Record<string, string>} field → message, empty when valid. */
export function validate(values) {
  const errors = {}
  for (const [field, rule] of Object.entries(RULES)) {
    const error = rule(values[field])
    if (error) errors[field] = error
  }
  return errors
}

/**
 * Last line of client-side defence before a payload leaves the browser.
 *
 * `validate` reports problems to a person who can fix them; this one silently
 * guarantees the invariant regardless of how the values got here — a pasted
 * value, a restored draft, or a `setField` call from somewhere that skipped
 * validation. The server does not trust this, and neither should we.
 */
export function clampToLimits(values) {
  const out = {}
  for (const [key, value] of Object.entries(values)) {
    out[key] =
      typeof value === 'string' && LIMITS[key] ? value.slice(0, LIMITS[key]) : value
  }
  return out
}
