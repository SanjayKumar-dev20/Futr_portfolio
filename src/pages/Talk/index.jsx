import { useRef, useState } from 'react'
import PageHero from '../../components/sections/PageHero'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { PrimaryCTA } from '../../components/buttons'
import { IconFactory, IconStore, IconChart } from '../../components/icons'
import ContactDetails from '../../components/contact/ContactDetails'
import { CONTACT, CONTACT_LINKS } from '../../data/navigation'
import { useContactStore } from '../../stores/contact'
import { LIMITS } from '../../lib/contact-schema'
import { useSeo } from '../../lib/seo'

/* ===========================================================================
   TALK
   ---------------------------------------------------------------------------
   This component renders the form. It does not know the validation rules, and
   it does not know how a message is delivered — both live in
   src/stores/contact.js, so the rules are readable and testable without
   mounting React, and this file stays a layout.
   =========================================================================== */

const PATHS = [
  { id: 'manufacturer', label: 'Manufacturer', action: 'Partner with Futr', Icon: IconFactory },
  { id: 'business', label: 'Business', action: 'Work with Futr', Icon: IconStore },
  { id: 'investor', label: 'Investor', action: 'Invest Futr', Icon: IconChart },
]

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
    <>
      <PageHero
        eyebrow="Talk"
        lines={["Let's Move Markets", { text: '— Together.', accent: true }]}
        body="Tell us which side of the market you're on. We'll come back to you with something useful, not a brochure."
        compact
      />

      {/* ── Path selection ───────────────────────────────────────────── */}
      <Section tone="bone" pad="sm" aria-labelledby="paths-heading">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <RevealOnScroll>
              <p className="t-eyebrow text-red">01 / Connect</p>
              <h2 id="paths-heading" className="mt-3 t-h2">Choose your path.</h2>
            </RevealOnScroll>
            <p className="max-w-[37ch] t-small text-ash sm:text-right">
              Pick what best describes you so we can direct your message to the right team.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3 md:gap-4">
            {PATHS.map(({ id, label, action, Icon }) => {
              const active = userType === id
              return (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => setUserType(id)}
                    aria-pressed={active}
                    className={[
                      'group flex h-full min-h-20 w-full items-center gap-4 rounded-sm border px-5 py-4 text-left transition-all duration-400 [transition-timing-function:var(--ease-out-quint)]',
                      active
                        ? 'border-red bg-paper shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]'
                        : 'border-rule bg-paper/60 hover:border-ink/25',
                    ].join(' ')}
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-400 ${
                        active ? 'border-red bg-red text-white' : 'border-rule text-ash'
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block text-[0.9375rem] font-bold tracking-[-0.01em]">{label}</span>
                      <span className="mt-0.5 block text-xs text-ash">{action}</span>
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* ── Form + contact details ───────────────────────────────────── */}
      <Section tone="light" pad="sm" aria-labelledby="form-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.85fr)] lg:gap-14 xl:gap-20">
            <div className="min-w-0">
              <p className="t-eyebrow text-red">02 / Your message</p>
              <h2 id="form-heading" className="mt-3 t-h2">
                Send it over.
              </h2>
              <p className="mt-3 max-w-[48ch] t-small text-ash">
                Share a few details and we’ll get back to you with a useful next step.
              </p>

              <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
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
                  name="subject"
                  label="Subject"
                  type="text"
                  required
                  value={values.subject}
                  onChange={set('subject')}
                  onBlur={blur('subject')}
                  error={touched.subject ? errors.subject : undefined}
                />

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

                {/*
                  Honeypot. Hidden from sight, from assistive tech and from the
                  tab order — a human cannot reach it, so anything in it came
                  from a bot filling every input on the page. `tabIndex={-1}`
                  and `aria-hidden` matter as much as the CSS: a screen-reader
                  user must never be asked to fill a trap.
                */}
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
                        That didn't go through — your message has been kept. Send
                        it directly to{' '}
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

            {/* Contact column */}
            <aside className="border-t border-rule pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-1 xl:pl-12">
              <p className="t-eyebrow text-red">03 / Direct</p>
              <h2 className="mt-3 t-h3">Prefer a conversation?</h2>
              <ContactDetails tone="light" iconSize={18} spacing="space-y-5" className="mt-7" />

              <div className="mt-8 border-t border-rule pt-6">
                <p className="max-w-[34ch] t-small text-ash">
                  Call during business hours and ask for the partnerships desk.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
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
