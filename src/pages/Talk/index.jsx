import { useRef, useState } from 'react'
import { Container, Section } from '../../components/system'
import { PrimaryCTA } from '../../components/buttons'
import ContactDetails from '../../components/contact/ContactDetails'
import { CONTACT, CONTACT_LINKS, CONTACT_PATHS } from '../../data/navigation'
import { useContactStore } from '../../stores/contact'
import { LIMITS } from '../../lib/contact-schema'
import { useNavTone } from '../../hooks'
import { useSeo } from '../../lib/seo'

/* ===========================================================================
   TALK
   ---------------------------------------------------------------------------
   This component renders the form. It does not know the validation rules, and
   it does not know how a message is delivered — both live in
   src/stores/contact.js, so the rules are readable and testable without
   mounting React, and this file stays a layout.

   ── Layout brief ──────────────────────────────────────────────────────────
   The page is a lead form, so the form is the page: a two-column split that
   lands complete inside the first screen on a 1080p desktop. Nothing a visitor
   needs in order to send an enquiry is below the fold.

       left   who you are talking to, which of the three paths you are on,
              and how to reach the office without using the form at all
       right  the form, open, on white, with the send button visible

   Two things that were wrong before and are worth naming so they do not come
   back:

   · The section opened at `pad="sm"`, which is 56px — less than the 88px
     navbar that floats over it. The heading rendered *underneath* the nav.
     Padding here is measured from `--nav-h`, not guessed.

   · The navbar starts transparent with white type because every other page
     opens on a dark hero. This one opens on bone, so the wordmark and all six
     links were white-on-#f7f7f5 and invisible until you scrolled. `useNavTone`
     tells the bar what it is sitting on.
   =========================================================================== */

/**
 * Five fields, not six.
 *
 * There was a "Subject" input here. It asked the visitor to restate, in prose,
 * the thing they had just answered by pressing "Manufacturer", "Business" or
 * "Investor" — and it was required, so an otherwise complete enquiry bounced on
 * it. The subject is now derived from the selected path at submit time (see
 * src/stores/contact.js), which is better information than most people typed
 * and costs them nothing.
 */
const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', required: true, autoComplete: 'name' },
  { name: 'company', label: 'Company', type: 'text', required: false, autoComplete: 'organization' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', required: false, autoComplete: 'tel' },
]

export default function Talk() {
  useSeo({
    title: "Talk — Let's Move Markets, Together | Futr Markets",
    description:
      'Partner with Futr, work with Futr, or invest. Tell us which side of the market you are on and we will come back to you.',
    path: '/talk',
  })

  useNavTone('light')

  const values = useContactStore((s) => s.values)
  const errors = useContactStore((s) => s.errors)
  const touched = useContactStore((s) => s.touched)
  const status = useContactStore((s) => s.status)
  const userType = useContactStore((s) => s.userType)
  const setUserType = useContactStore((s) => s.setUserType)
  const setField = useContactStore((s) => s.setField)
  const blurField = useContactStore((s) => s.blurField)
  const submit = useContactStore((s) => s.submit)

  const formRef = useRef(null)
  // Pre-filled mailto handed back when a send fails, so the enquiry is one
  // click from being delivered instead of retyped.
  const [failedMailto, setFailedMailto] = useState(null)

  const set = (name) => (e) => setField(name, e.target.value)
  const blur = (name) => () => blurField(name)

  async function onSubmit(e) {
    e.preventDefault()
    const { ok, mailto } = await submit()
    setFailedMailto(mailto ?? null)
    if (!ok) {
      // Move focus to the first problem so keyboard and SR users aren't stranded.
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    }
  }

  return (
    <Section
      tone="bone"
      pad="none"
      className="pb-16 pt-[calc(var(--nav-h)+2.5rem)] md:pb-24 md:pt-[calc(var(--nav-h)+3.5rem)]"
      aria-labelledby="form-heading"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(20rem,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
          {/* ── Left: who, which path, and the direct line ─────────────── */}
          <div>
            <p className="t-eyebrow text-red">Talk to Futr</p>

            {/* Tight under the eyebrow, open before the paragraph — the same
                hierarchy rule the feature cards follow.

                The break is written rather than left to the measure: "Let's
                Move Markets" over a red "Together." The column is sized so
                that line holds at the display cap; at `max-w-[12ch]` it broke
                into three ragged lines instead. */}
            <h1 id="form-heading" className="mt-4 t-display">
              <span className="block">Let's Move Markets</span>
              <span className="block text-red">Together.</span>
            </h1>

            <p className="mt-6 max-w-[42ch] t-body text-ash">
              Tell us which side of the market you're on. We'll come back with a
              useful next step — not a brochure.
            </p>

            {/*
              The path toggle.

              `aria-pressed` rather than a radio group because these are
              buttons that change the enquiry's routing, and a screen reader
              should hear "Business, pressed". The value is submitted with the
              form regardless of which control shape it wears.
            */}
            <fieldset className="mt-9">
              <legend className="t-eyebrow text-ash">I'm a</legend>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {CONTACT_PATHS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setUserType(id)}
                    aria-pressed={userType === id}
                    className={[
                      'rounded-full border px-5 py-2.5 text-sm font-semibold',
                      'transition-colors duration-300',
                      userType === id
                        ? 'border-red bg-red text-white'
                        : 'border-rule bg-white text-ash hover:border-ink/40 hover:text-ink',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-10 border-t border-rule pt-7">
              <p className="t-eyebrow text-red">Direct contact</p>
              <ContactDetails tone="light" iconSize={18} spacing="space-y-3.5" className="mt-5" />
              <p className="mt-5 max-w-[38ch] t-small text-ash">
                Call during business hours and ask for the partnerships desk.
              </p>
            </div>
          </div>

          {/* ── Right: the form, open on load ──────────────────────────── */}
          <div className="min-w-0 rounded-sm border border-rule bg-white p-7 shadow-[0_24px_60px_-48px_rgba(0,0,0,0.28)] sm:p-9 lg:p-10">
            <p className="t-eyebrow text-red">Send a message</p>
            <h2 className="mt-3 t-h2">How can we help?</h2>

            <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
              <div className="grid gap-x-7 gap-y-4 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <Field
                    key={field.name}
                    {...field}
                    value={values[field.name]}
                    onChange={set(field.name)}
                    onBlur={blur(field.name)}
                    error={touched[field.name] ? errors[field.name] : undefined}
                  />
                ))}
              </div>

              <Field
                name="message"
                label="Message"
                textarea
                required
                value={values.message}
                onChange={set('message')}
                onBlur={blur('message')}
                error={touched.message ? errors.message : undefined}
              />

              <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
                <label htmlFor="f-website">Website (leave blank)</label>
                <input
                  id="f-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={set('website')}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <PrimaryCTA
                  size="lg"
                  type="submit"
                  disabled={status === 'loading'}
                  arrow={status !== 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Send message'}
                </PrimaryCTA>
                <p aria-live="polite" className="min-w-0 flex-1 t-small">
                  {status === 'success' && (
                    <span className="text-ink">
                      Sent. We'll come back to you within two working days.
                    </span>
                  )}
                  {status === 'mailto' && (
                    <span className="text-ash">
                      Your mail app should have opened with this message ready to send.
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="text-red">
                      That didn't go through — your message has been kept. Send it directly to{' '}
                      <a
                        href={failedMailto || CONTACT_LINKS.email}
                        className="underline decoration-red decoration-2 underline-offset-4"
                      >
                        {CONTACT.email}
                      </a>
                      .
                    </span>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* ── Form primitives ─────────────────────────────────────────────────────
   Floating-free labels: the label always sits above the input, because a
   placeholder-only label disappears exactly when the user needs it most. */
function Field({ name, label, type = 'text', required, textarea, value, onChange, onBlur, error, autoComplete }) {
  const id = `f-${name}`
  const describedBy = error ? `${id}-err` : undefined

  const shared = {
    id,
    name,
    value,
    onChange,
    onBlur,
    required,
    autoComplete,
    // Length is enforced in three places — here so the browser simply will not
    // accept more, in the store so a programmatic set cannot exceed it, and in
    // the Apps Script because neither of the first two is trustworthy. See
    // src/lib/contact-schema.js.
    maxLength: LIMITS[name],
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    /*
      `text-base sm:text-[0.9375rem]` — 16px on phones, the designed 15px from
      the small breakpoint up.

      iOS Safari zooms the whole page in when a focused input's font-size is
      below 16px, and it does not zoom back out on blur. On a 15px field that
      means tapping "Name" leaves the visitor scrolled sideways through a form
      they now have to pan across. Setting 16px at phone widths is the only
      fix that does not involve `maximum-scale=1`, which would take pinch-zoom
      away from everyone who needs it.
    */
    className: [
      'w-full border-0 border-b bg-transparent px-0 py-3 outline-none',
      'text-base sm:text-[0.9375rem]',
      'transition-colors duration-300 placeholder:text-ash/50',
      error ? 'border-red' : 'border-rule focus:border-ink',
    ].join(' '),
  }

  return (
    <div className={textarea ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="t-eyebrow block text-ash">
        {label}
        {required && <span className="ml-1 text-red">*</span>}
      </label>

      {textarea ? (
        <textarea {...shared} rows={4} className={`${shared.className} resize-y`} />
      ) : (
        <input {...shared} type={type} />
      )}

      {error && (
        <p id={`${id}-err`} className="mt-2 text-xs text-red">
          {error}
        </p>
      )}
    </div>
  )
}
