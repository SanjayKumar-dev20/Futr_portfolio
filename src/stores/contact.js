import { create } from 'zustand'
import { CONTACT, CONTACT_PATH_LABEL } from '../data/navigation'
import { buildMailto, hasBackend, submitEnquiry } from '../lib/enquiry'
import { LIMITS, RULES, clampToLimits, validate } from '../lib/contact-schema'

/**
 * Talk-page enquiry form.
 *
 * Three responsibilities, deliberately in three files:
 *
 *   src/lib/contact-schema.js  what a valid enquiry is   (rules, limits)
 *   this file                  what the form is doing    (values, status)
 *   src/lib/enquiry.js         how a message is sent     (transport)
 *
 * All three used to live inside the Talk component, which meant that page was
 * simultaneously a layout, a form controller, a validator and a transport.
 *
 * Transport is deliberately honest: with no endpoint configured it hands off
 * to the user's mail client and says so. It never reports success for a
 * message that went nowhere.
 */

const EMPTY = {
  name: '',
  company: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  // Honeypot. Never shown to a human, never focusable — so anything in it came
  // from a bot filling every input it found. Cheap, silent, and costs real
  // users nothing, unlike a CAPTCHA.
  website: '',
}

// Re-exported so existing importers keep working and so there is still one
// obvious place to look for the rules from a component.
export { RULES, LIMITS, validate }

/** Minimum seconds a genuine visitor takes to read and fill this form. */
const MIN_FILL_SECONDS = 3

/**
 * Minimum gap between two accepted submissions from this tab.
 *
 * The real rate limit is the server's — this one cannot be trusted and is not
 * meant to be. It exists so that a double-clicked Send button, or an impatient
 * retry after a slow network, does not cost a duplicate row and a duplicate
 * notification email. Anything genuinely hostile skips the browser entirely.
 */
const RESUBMIT_COOLDOWN_MS = 4000

/**
 * The subject line, when the visitor was never asked for one.
 *
 * The redesigned Talk page asks for five things — name, company, email, phone,
 * message — and nothing else. "What is this about" is already answered by the
 * path the visitor selected, so asking again is a sixth field that buys the
 * administrator nothing.
 *
 * The field itself stays in the schema. It is what the notification threads on,
 * and the Apps Script re-validates it server-side; dropping it would mean
 * changing the sheet, the script and the rules to delete information the inbox
 * actually uses. So it is derived here instead, from the two values that make
 * an enquiry findable later: who they said they were, and what they are called.
 *
 * Clamped, because `LIMITS.subject` is 200 and a 120-character name is legal.
 */
function derivedSubject(userType, name) {
  const role = CONTACT_PATH_LABEL[userType] ?? 'General'
  const who = name?.trim()
  return `${role} enquiry${who ? ` — ${who}` : ''}`.slice(0, LIMITS.subject)
}

export const useContactStore = create((set, get) => ({
  values: { ...EMPTY },
  errors: {},
  touched: {},
  userType: 'business',
  status: 'idle', // idle | loading | success | mailto | error
  /** Set on first interaction; used to reject sub-second bot submissions. */
  startedAt: null,
  /** When the last submission was accepted, for the double-click guard. */
  lastSubmitAt: null,

  setUserType: (userType) => set({ userType }),

  setField: (field, value) =>
    set((s) => {
      // Hard-capped here as well as via `maxLength` on the input: a paste into
      // a field the browser does not enforce, or a value set from anywhere
      // other than a keystroke, must not be able to exceed the limit.
      const capped = LIMITS[field] ? value.slice(0, LIMITS[field]) : value
      const values = { ...s.values, [field]: capped }
      // Only re-validate a field the user has already left once, so errors
      // appear on blur rather than on the first keystroke.
      const errors = s.touched[field] ? validate(values) : s.errors
      return { values, errors, startedAt: s.startedAt ?? Date.now() }
    }),

  blurField: (field) =>
    set((s) => ({
      touched: { ...s.touched, [field]: true },
      errors: validate(s.values),
    })),

  /**
   * Returns { ok, errors }. The component uses `ok` to decide whether to move
   * focus to the first invalid control.
   */
  submit: async () => {
    const { values: entered, userType, startedAt, status, lastSubmitAt } = get()

    // Already in flight. A second submit would race the first and can only
    // produce a duplicate.
    if (status === 'loading') return { ok: false, errors: {} }

    // Fill the subject the form no longer asks for. `||` not `??` on purpose:
    // an empty string is exactly the case this is here to handle.
    const values = {
      ...entered,
      subject: entered.subject?.trim() || derivedSubject(userType, entered.name),
    }

    const errors = validate(values)

    set({
      values,
      errors,
      touched: Object.fromEntries(Object.keys(RULES).map((k) => [k, true])),
    })

    if (Object.keys(errors).length) return { ok: false, errors }

    /*
      Bot checks, in order of how cheap they are.

      Both fail *silently* — the bot is told everything went fine. Telling it
      why it was rejected just teaches whoever wrote it how to get past the
      check next time, and a real person can never trigger either of these.
    */
    const tooFast = startedAt && Date.now() - startedAt < MIN_FILL_SECONDS * 1000
    if (values.website || tooFast) {
      set({ status: 'success', values: { ...EMPTY }, touched: {}, startedAt: null })
      return { ok: true, errors: {} }
    }

    // A second press inside the cooldown is a double-click, not a second
    // enquiry. Report the success that already happened rather than sending
    // again — the alternative is two identical rows and two identical emails.
    if (lastSubmitAt && Date.now() - lastSubmitAt < RESUBMIT_COOLDOWN_MS) {
      return { ok: true, errors: {} }
    }

    // `website` is the honeypot — it must never reach a backend or an inbox.
    const { website: _honeypot, ...rest } = values
    const clean = clampToLimits(rest)

    // Async: the backend is read from a config file the client edits after
    // handover, not from the bundle.
    if (!(await hasBackend())) {
      window.location.href = buildMailto({ ...clean, userType }, CONTACT.email)
      set({ status: 'mailto', lastSubmitAt: Date.now() })
      return { ok: true, errors: {} }
    }

    set({ status: 'loading' })
    const result = await submitEnquiry(clean, userType)

    if (result.ok) {
      set({
        status: 'success',
        values: { ...EMPTY },
        touched: {},
        startedAt: null,
        lastSubmitAt: Date.now(),
      })
      return { ok: true, errors: {} }
    }

    // The send failed. The enquiry is already held in local storage by
    // submitEnquiry; surface the mail route so it is not lost. No cooldown is
    // set — a failure is exactly the case where retrying should be allowed.
    set({ status: 'error' })
    return { ok: false, errors: {}, mailto: buildMailto({ ...clean, userType }, CONTACT.email) }
  },

  reset: () =>
    set({ values: { ...EMPTY }, errors: {}, touched: {}, status: 'idle', startedAt: null }),
}))
