import { useInView } from '../../hooks'
import { cutFocalX, getTreatment } from './imageTreatments'

/**
 * Every photograph on the site goes through this component.
 *
 * It exists because of two specific client notes:
 *
 *   "Some cut out of human like the one I had would be nice — dark background.
 *    This doesn't bring focus into the core emotion."
 *   "I want to be realistic with the images... I am a small company now, but it
 *    should convey the base emotion."
 *
 * The component's single job is: observe, reveal, and render an image under a
 * named treatment. What each treatment *looks* like lives in imageTreatments.js
 * so a new one never means editing this file.
 *
 * Paths resolve through src/data/images.js, so the client's own photography
 * drops in by filename with no code change.
 */
export default function ImageFrame({
  src,
  alt = '',
  treatment = 'editorial',
  /** Cut-out only: which edge dissolves (the one the copy is on). */
  side = 'left',
  /** e.g. '4/5', '16/9' — omit to fill the parent. */
  ratio,
  /** Red hairline that draws in on reveal. */
  rule = false,
  /** Dark gradient for copy laid on top. */
  scrim = false,
  priority = false,
  className = '',
  imgClassName = '',
  children,
}) {
  const [ref, inView] = useInView({ threshold: 0.12 })
  const spec = getTreatment(treatment)

  const classes = [
    'img-frame',
    ...spec.classes,
    rule && 'img-rule',
    scrim && 'img-scrim',
    inView && 'is-in',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={ref}
      className={classes}
      style={{
        ...(ratio ? { aspectRatio: ratio } : null),
        ...(spec.usesCutout ? { '--cut-x': cutFocalX(side) } : null),
      }}
    >
      {/*
        The wipe lives on this inner element, never on the observed one.
        `clip-path: inset(0 0 100%)` collapses an element's intersection rect
        to zero area, so an IntersectionObserver watching the clipped node can
        never fire — the reveal would deadlock waiting on itself.
      */}
      <div className={`reveal-mask absolute inset-0 overflow-hidden ${inView ? 'is-in' : ''}`}>
        {src && (
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            className={imgClassName}
          />
        )}
      </div>
      {children}
    </div>
  )
}

/**
 * Cut-out figure composed against a dark panel. This is the exact lockup the
 * client asked for; the Home CTA band and both Let's Grow panels use it.
 *
 * `--cut-x` is set once by ImageFrame and inherits to the vignette, so the
 * mask, the vignette and the rim light cannot drift apart.
 */
export function CutoutFigure({
  src,
  alt = '',
  side = 'left',
  className = '',
  glow = true,
  ratio = '4/5',
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: ratio }}>
      {/* Glow only — no grid. Every surface that hosts a cut-out already lays
          its own grid down, and a second one starting at this box's edge drew
          a visible seam across the panel. */}
      {glow && (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div className="glow-red absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 translate-y-1/4 opacity-70" />
        </div>
      )}

      <ImageFrame
        src={src}
        alt={alt}
        treatment="cutout"
        side={side}
        className="absolute inset-0 !bg-transparent before:!hidden"
      >
        <span aria-hidden className="img-cutout-vignette" />
      </ImageFrame>
    </div>
  )
}
