import { Container, RevealOnScroll, Section } from '../system'
import SectionIntro from './SectionIntro'
import { useInView } from '../../hooks'
import { riseIn } from '../../lib/motion'

/* ===========================================================================
   SECTION BLOCKS
   ---------------------------------------------------------------------------
   The Creative Framework reuses a small number of content shapes across The
   Futr Difference, Manufacturers, Futr X and Invest Futr: a numbered principle
   list, a staged process, an advantage grid, a problem/fix table and a full
   -width statement. Each is built once here.

   The framework's design direction is the constraint these follow: "wide white
   sections with short, strong copy blocks — rhythm, not bulk" and "flow lines,
   network grids or connection visuals instead of product shots."
   =========================================================================== */

/**
 * Numbered principles with a red rail that fills as the list scrolls past.
 * Used for the three core principles, the three system layers, the three
 * growth engines and the three Futr X pillars.
 */
export function PrincipleList({ items = [], tone = 'light', numbered = true, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const dark = tone === 'dark'

  return (
    <ol ref={ref} className={`relative ${className}`}>
      {/* The rail. Scales from the top as the section arrives — the brief's
          "a red line travels between the principles". */}
      <span
        aria-hidden
        className={`absolute left-0 top-2 w-px ${dark ? 'bg-white/12' : 'bg-rule'}`}
        style={{ height: 'calc(100% - 1rem)' }}
      />
      <span
        aria-hidden
        className="absolute left-0 top-2 w-px origin-top bg-red"
        style={{
          height: 'calc(100% - 1rem)',
          transform: `scaleY(${inView ? 1 : 0})`,
          transition: 'transform 1.4s var(--ease-out-expo) 120ms',
        }}
      />

      {items.map((item, i) => (
        <li key={item.title} className="relative pl-8 pb-10 last:pb-0 md:pl-12">
          <span
            aria-hidden
            className="absolute -left-[3px] top-2 h-[7px] w-[7px] rounded-full bg-red"
            style={riseIn(inView, 240 + i * 140, { distance: 0, duration: 500 })}
          />
          <div style={riseIn(inView, 200 + i * 140)}>
            {numbered && (
              <p className={`t-eyebrow ${dark ? 'text-white/35' : 'text-chalk'}`}>
                {String(i + 1).padStart(2, '0')}
              </p>
            )}
            <h3 className="mt-3 t-h3">{item.title}</h3>
            <p className={`mt-2 max-w-[48ch] t-small ${dark ? 'text-white/60' : 'text-ash'}`}>
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/**
 * 01 → 04 staged process with a connecting line.
 * The framework uses this shape twice: the manufacturer path from test to
 * scale, and the Futr X path from launch to leadership.
 */
export function ProcessSteps({ steps = [], tone = 'light', className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const dark = tone === 'dark'

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Horizontal connector on desktop, vertical on mobile. */}
      <span
        aria-hidden
        className={`absolute left-0 top-[11px] hidden h-px w-full md:block ${
          dark ? 'bg-white/12' : 'bg-rule'
        }`}
      />
      <span
        aria-hidden
        className="absolute left-0 top-[11px] hidden h-px w-full origin-left bg-red md:block"
        style={{
          transform: `scaleX(${inView ? 1 : 0})`,
          transition: 'transform 1.6s var(--ease-out-expo) 160ms',
        }}
      />

      <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((step, i) => (
          <li key={step.title} style={riseIn(inView, 200 + i * 130)}>
            <span
              aria-hidden
              className={`block h-[23px] ${dark ? '' : ''}`}
            >
              <span className="block h-[7px] w-[7px] translate-y-[8px] rounded-full bg-red" />
            </span>
            <p className={`t-eyebrow ${dark ? 'text-white/35' : 'text-chalk'}`}>
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-3 t-h3">{step.title}</h3>
            <p className={`mt-2 t-small ${dark ? 'text-white/60' : 'text-ash'}`}>{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Hairline-bordered advantage cards. Four-up on desktop, two-up on tablet. */
export function AdvantageGrid({ items = [], tone = 'light', columns = 4, className = '' }) {
  const dark = tone === 'dark'
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }

  return (
    <div className={`grid gap-px ${cols[columns]} ${dark ? 'bg-white/10' : 'bg-rule'} ${className}`}>
      {items.map((item, i) => (
        <RevealOnScroll
          key={item.title}
          delay={i * 90}
          className={dark ? 'surface-void' : 'surface-light'}
        >
          <article className="h-full p-7 md:p-8">
            <p className={`t-eyebrow ${dark ? 'text-white/30' : 'text-chalk'}`}>
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-5 t-h3">{item.title}</h3>
            <p className={`mt-3 t-small ${dark ? 'text-white/60' : 'text-ash'}`}>{item.body}</p>
          </article>
        </RevealOnScroll>
      ))}
    </div>
  )
}

/** Plain outcome/benefit list with red ticks. */
export function OutcomeList({ items = [], tone = 'light', className = '' }) {
  const dark = tone === 'dark'
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, i) => (
        <RevealOnScroll as="li" key={item} delay={i * 80} className="flex gap-3">
          <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-red" />
          <span className={`t-small ${dark ? 'text-white/70' : 'text-ash'}`}>{item}</span>
        </RevealOnScroll>
      ))}
    </ul>
  )
}

/**
 * Problem → fix pairs. The framework presents these as columns; rendering them
 * as a two-column table makes the "practical problems, practical fixes" pairing
 * readable rather than decorative.
 */
export function ProblemSolution({ pairs = [], tone = 'light', className = '' }) {
  const dark = tone === 'dark'
  const line = dark ? 'border-white/10' : 'border-rule'

  return (
    <div className={`border-t ${line} ${className}`}>
      {pairs.map((pair, i) => (
        <RevealOnScroll
          key={pair.problem}
          delay={i * 90}
          className={`grid grid-cols-1 gap-2 border-b ${line} py-5 sm:grid-cols-[1fr_auto_1.4fr] sm:items-baseline sm:gap-6`}
        >
          <p className={`text-[0.9375rem] font-semibold ${dark ? 'text-white/50' : 'text-ash'}`}>
            {pair.problem}
          </p>
          <span aria-hidden className="hidden text-red sm:block">
            →
          </span>
          <p className="text-[0.9375rem] font-semibold">{pair.fix}</p>
        </RevealOnScroll>
      ))}
    </div>
  )
}

/**
 * Full-width statement band. The framework closes several pages on a single
 * assertion; this gives it the whole viewport rather than burying it in a
 * paragraph.
 */
export function StatementBand({ children, tone = 'dark', eyebrow, pad = 'lg' }) {
  return (
    <Section tone={tone} pad={pad} className="overflow-hidden grain">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-25 mask-fade" />
        <div className="glow-red absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-35" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-[56rem] text-center">
          {eyebrow && (
            <RevealOnScroll>
              <p className="t-eyebrow justify-center text-red">{eyebrow}</p>
            </RevealOnScroll>
          )}
          <RevealOnScroll delay={90}>
            <p className="mt-6 t-display">{children}</p>
          </RevealOnScroll>
        </div>
      </Container>
    </Section>
  )
}

export { SectionIntro }
