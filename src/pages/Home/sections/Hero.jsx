import HeroVideo from '../../../components/media/HeroVideo'
import { PrimaryCTA, SecondaryCTA } from '../../../components/buttons'
import { AnimatedHeading } from '../../../components/system'
import { IconCube, IconFactory, IconStore, IconUsers } from '../../../components/icons'
import { useInView } from '../../../hooks'
import { fadeIn, riseIn, stagger } from '../../../lib/motion'
import HOME from '../../../data/content/home'

/**
 * Section 01 — Hero.
 *
 * The visual is the client's supplied 3D loop, full-bleed. It replaced the
 * WebGL market network rather than joining it: both render the same subject —
 * a dark globe wrapped in a red node lattice — and two of them on one screen
 * would just be a mistake. The video also costs 2.4 MB against Three.js's
 * ~240 kB gzipped *plus* the runtime GPU work, and it never drops frames on a
 * weak laptop.
 *
 * Sequence (staged with transition-delay rather than a JS timeline, so it
 * survives a slow video fetch without desyncing):
 *   grid in → heading lines → body → CTAs → orbit labels → scroll indicator
 */

const ORBIT = [
  { label: 'Manufacturers', Icon: IconFactory, pos: 'left-[6%] top-[14%]', delay: 1150 },
  { label: 'Products', Icon: IconCube, pos: 'right-[2%] top-[9%]', delay: 1250 },
  { label: 'Businesses', Icon: IconStore, pos: 'right-[6%] bottom-[22%]', delay: 1350 },
  { label: 'Consumers', Icon: IconUsers, pos: 'left-[2%] bottom-[14%]', delay: 1450 },
]

export default function Hero() {
  const [ref, inView] = useInView({ threshold: 0.05 })

  // Body copy and CTAs follow the three-line heading reveal, which runs from
  // 320ms at 110ms per line.
  const copyAt = stagger(780, 140)

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] overflow-hidden surface-void on-dark grain"
      aria-labelledby="hero-heading"
    >
      {/* ── Video ────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={fadeIn(inView, 0, { duration: 1600 })}
      >
        <HeroVideo className="h-full w-full" />
      </div>

      {/* ── Scrim ────────────────────────────────────────────────────────
          Two passes. The horizontal one clears the left column so the headline
          sits on near-black regardless of what the loop is doing behind it;
          the vertical one keeps the nav and the scroll cue legible. Without
          these the particle plane runs straight through the body copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,6,7,0.95)_0%,rgba(6,6,7,0.88)_26%,rgba(6,6,7,0.55)_48%,rgba(6,6,7,0.12)_72%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,6,7,0.8)_0%,transparent_22%,transparent_72%,rgba(6,6,7,0.85)_100%)]" />
      </div>

      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        <div
          className="absolute inset-0 bg-grid mask-fade"
          style={{ ...fadeIn(inView), opacity: inView ? 0.4 : 0 }}
        />
      </div>

      {/* ── Orbit labels ─────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <div className="relative mx-auto h-full w-full max-w-[1440px]">
          <div className="absolute inset-y-0 right-0 w-[62%] xl:w-[58%]">
            {ORBIT.map(({ label, Icon, pos, delay }) => (
              <div
                key={label}
                className={`absolute flex items-center gap-3 ${pos}`}
                style={riseIn(inView, delay, { distance: 12, duration: 900 })}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-void/60 text-white backdrop-blur-sm">
                  <Icon size={19} />
                </span>
                <span className="t-eyebrow whitespace-nowrap text-white/85">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Copy ─────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex min-h-[100svh] items-center pt-[var(--nav-h)]">
        <div className="fm-container w-full">
          <div className="max-w-[40rem] lg:max-w-[34rem] xl:max-w-[38rem]">
            <p className="t-eyebrow text-white/70" style={riseIn(inView, 120, { distance: 8 })}>
              {HOME.hero.eyebrow}
            </p>

            <AnimatedHeading
              id="hero-heading"
              className="mt-7"
              delay={320}
              step={110}
              lines={HOME.hero.lines}
            />

            <p
              className="mt-7 max-w-[34rem] t-body text-white/70"
              style={riseIn(inView, copyAt(0))}
            >
              {HOME.hero.body}
            </p>

            <div
              className="mt-10 flex flex-wrap items-center gap-3"
              style={riseIn(inView, copyAt(1))}
            >
              <PrimaryCTA to="/difference" size="lg">
                Explore the Futr
              </PrimaryCTA>
              <SecondaryCTA to="/grow" size="lg" tone="dark">
                Let's Grow
              </SecondaryCTA>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <div
        className={[
          'absolute bottom-8 left-0 right-0 z-20',
          'transition-opacity duration-700',
          inView ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{ transitionDelay: '1600ms' }}
      >
        <div className="fm-container flex items-center gap-3 text-white/55">
          <span
            aria-hidden
            className="grid h-7 w-[1.1rem] place-items-start justify-center rounded-full border border-white/30 pt-1.5"
          >
            <span className="scroll-dot block h-1 w-1 rounded-full bg-red" />
          </span>
          <span className="t-eyebrow">Scroll</span>
        </div>
      </div>
    </section>
  )
}
