import { Link } from 'react-router-dom'
import ImageFrame from '../../../components/media/ImageFrame'
import { CircleArrow, PrimaryCTA } from '../../../components/buttons'
import { useInView } from '../../../hooks'
import { riseIn } from '../../../lib/motion'
import IMAGES from '../../../data/images'
import HOME from '../../../data/content/home'

/**
 * Section 02 — the business / manufacturer split.
 *
 * Not two cards. Two halves of one full-bleed band, with the network lines
 * lighting up on the hovered side. On touch and narrow viewports it stacks and
 * both panels sit at rest — hover expansion is a pointer affordance and faking
 * it on mobile just causes jank.
 *
 * Order matters and comes from the Creative Framework (page 12), which places
 * Businesses & Shopkeepers on the LEFT and Manufacturers on the RIGHT. An
 * earlier build had these reversed.
 *
 * Photography note: both images are real Indian operations at the scale the
 * client actually works at — an owner in his own shop and a textile unit floor
 * — because the brief was explicit that the previous comp "looks like we are a
 * very big company."
 */

/** Photography per panel, keyed to the framework's content order. */
const PANEL_IMAGES = {
  businesses: IMAGES.shopkeeper,
  manufacturers: IMAGES.manufacturingFloor,
}

export default function SplitPanels() {
  return (
    <section
      aria-label="Who Futr Markets works with"
      className="relative grid grid-cols-1 lg:grid-cols-2"
    >
      {HOME.split.map(({ key, ...panel }, i) => (
        <Panel key={key} {...panel} image={PANEL_IMAGES[key]} index={i} />
      ))}

      {/* Hairline seam between the two halves */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/15 lg:block"
      />
    </section>
  )
}

function Panel({ eyebrow, heading, subline, body, cta, image, side, index }) {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <article
      ref={ref}
      className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden surface-void on-dark md:min-h-[32rem] lg:min-h-[34rem]"
    >
      {/* Photograph */}
      <ImageFrame
        src={image.src}
        alt={image.alt}
        treatment="editorial"
        className="absolute inset-0 -z-10"
        imgClassName="object-cover"
      />

      {/* Scrim, in two passes. The directional one pushes the photograph away
          from the copy side; the vertical one guarantees the headline and body
          clear AA contrast regardless of what the photograph does down there. */}
      <div
        aria-hidden
        className={[
          'absolute inset-0 -z-10',
          side === 'right'
            ? 'bg-[linear-gradient(100deg,rgba(6,6,7,0.92)_4%,rgba(6,6,7,0.62)_46%,rgba(6,6,7,0.18)_100%)]'
            : 'bg-[linear-gradient(260deg,rgba(6,6,7,0.92)_4%,rgba(6,6,7,0.62)_46%,rgba(6,6,7,0.18)_100%)]',
        ].join(' ')}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(6,6,7,0.97)_0%,rgba(6,6,7,0.88)_26%,rgba(6,6,7,0.45)_55%,rgba(6,6,7,0.1)_100%)]"
      />

      {/* Network lines that activate on hover */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-fine text-white opacity-0 transition-opacity duration-700 group-hover:opacity-50" />
        <div className="glow-red absolute -bottom-20 left-1/4 h-72 w-72 opacity-0 transition-opacity duration-700 group-hover:opacity-70" />
      </div>

      {/* Copy */}
      <div className="relative flex items-end justify-between gap-6 p-8 md:p-12 lg:p-14">
        <div
          className="max-w-[26rem]"
          style={riseIn(inView, 160 + index * 120, { distance: 28, duration: 900 })}
        >
          <p className="t-eyebrow text-white/70">{eyebrow}</p>

          <h2 className="mt-4 t-display">
            {heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          {subline && (
            <p className="mt-3 text-[0.9375rem] font-semibold text-white/85">{subline}</p>
          )}

          <p className="mt-3 max-w-[24rem] t-small text-white/70">{body}</p>

          <PrimaryCTA to={cta.to} size="md" className="mt-7">
            {cta.label}
          </PrimaryCTA>
        </div>

        {/* The corner circle-arrow from the comp */}
        <Link
          to={cta.to}
          aria-label={cta.label}
          className="mb-1 hidden shrink-0 sm:block"
        >
          <CircleArrow tone="dark" size={46} as="span" aria-hidden aria-label={undefined} />
        </Link>
      </div>

      {/* Red rule that draws across the base of the active panel */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100"
      />
    </article>
  )
}
