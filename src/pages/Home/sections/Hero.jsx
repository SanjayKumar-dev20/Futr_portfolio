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

/*
  The four annotations that ring the globe.

  These were positioned inside a 1440px-capped wrapper and pushed to its outer
  corners, which put them in the window's corners rather than on the globe — the
  "disjointed, spread too far out" note. The video is full-bleed `object-cover`,
  so the only frame the globe is actually fixed to is the section itself; that
  is what the percentages below are measured against.

  Globe, as a share of the section at desktop: centre ≈ (74%, 48%), radius ≈ 23%
  of the width and ≈ 40% of the height. Each badge is placed on that ellipse
  rather than at a corner, so the set reads as labelling one object:

           Products  ~60°          Manufacturers ~145°
           Businesses ~-42°        Consumers     ~-142°

  `flip` reverses the icon/label order for the two on the right-hand side. The
  label then runs inward, toward the globe, instead of off the edge of the
  window — which is what forced them so far out in the first place.
*/
const ORBIT = [
  { label: 'Manufacturers', Icon: IconFactory, pos: 'left-[55%] top-[25%]', delay: 1150 },
  { label: 'Products', Icon: IconCube, pos: 'right-[11%] top-[14%]', flip: true, delay: 1250 },
  { label: 'Businesses', Icon: IconStore, pos: 'right-[9%] bottom-[25%]', flip: true, delay: 1350 },
  { label: 'Consumers', Icon: IconUsers, pos: 'left-[56%] bottom-[20%]', delay: 1450 },
]

export default function Hero() {
  const [ref, inView] = useInView({ threshold: 0.05 })

  // Body copy and CTAs follow the two-line heading reveal, which runs from
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
        <HeroVideo className="h-full w-full brightness-[0.6]" />
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
        {ORBIT.map(({ label, Icon, pos, flip, delay }) => (
          <div
            key={label}
            className={`absolute flex items-center gap-2.5 ${flip ? 'flex-row-reverse' : ''} ${pos}`}
            style={riseIn(inView, delay, { distance: 12, duration: 900 })}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-void/55 text-white backdrop-blur-sm">
              <Icon size={16} />
            </span>
            <span className="whitespace-nowrap text-[0.625rem] font-semibold uppercase leading-none tracking-[0.2em] text-white/80">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Copy ─────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex min-h-[100svh] items-center pt-[var(--nav-h)]">
        <div className="fm-container w-full">
          {/*
            One measure for the whole lockup, so the eyebrow, the two heading
            lines and the body all start and end on the same two verticals. The
            gaps are a deliberate 6 / 7 / 10 ramp: tight under the eyebrow
            (it belongs to the heading), open under the heading, open again
            before the actions.
          */}
          <div className="max-w-[46rem] xl:max-w-[52rem]">
            <p className="t-eyebrow text-white/70" style={riseIn(inView, 120, { distance: 8 })}>
              {HOME.hero.eyebrow}
            </p>

            <AnimatedHeading
              id="hero-heading"
              className="mt-6 home-hero-heading"
              delay={320}
              step={110}
              lines={HOME.hero.lines}
            />

            <p
              className="mt-7 max-w-[36rem] t-body text-white/70"
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
