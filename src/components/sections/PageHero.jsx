import { AnimatedHeading, Container, NetworkBackdrop } from '../system'
import { useInView } from '../../hooks'
import { riseIn, stagger } from '../../lib/motion'

/**
 * Shared hero for every page other than Home.
 *
 * Home carries the client's video loop; interior pages get the same dark
 * environment rendered in CSS. That is the plan's "three major scenes are
 * enough" rule — a WebGL context or a video decode per route would be the
 * single biggest performance mistake available here.
 */
export default function PageHero({
  eyebrow,
  lines = [],
  body,
  children,
  tone = 'void',
  align = 'left',
}) {
  const [ref, inView] = useInView({ threshold: 0.1 })
  const centered = align === 'center'

  // The heading reveals line by line from 160ms; everything after it follows on
  // the same cadence rather than three hand-picked numbers.
  const at = stagger(620, 140)

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden grain ${
        tone === 'void' ? 'surface-void' : 'surface-dark'
      } on-dark`}
    >
      <NetworkBackdrop variant="both" glow />

      <Container className="relative">
        <div
          className={[
            'pb-20 pt-[calc(var(--nav-h)+5rem)] md:pb-28 md:pt-[calc(var(--nav-h)+7rem)]',
            centered ? 'mx-auto max-w-[46rem] text-center' : 'max-w-[52rem]',
          ].join(' ')}
        >
          {eyebrow && (
            <p
              className={`t-eyebrow text-red ${centered ? 'justify-center' : ''}`}
              style={riseIn(inView, 0, { distance: 8 })}
            >
              {eyebrow}
            </p>
          )}

          <AnimatedHeading lines={lines} className="mt-6" delay={160} />

          {body && (
            <p
              className={`mt-7 max-w-[46ch] t-body text-white/70 ${centered ? 'mx-auto' : ''}`}
              style={riseIn(inView, at(0))}
            >
              {body}
            </p>
          )}

          {children && (
            <div
              className={`mt-10 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}
              style={riseIn(inView, at(1))}
            >
              {children}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
