import { Children, cloneElement, isValidElement } from 'react'
import { useInView } from '../../hooks'

/* ===========================================================================
   LAYOUT
   =========================================================================== */

/** 1440px max, 64/32/20px responsive padding — the grid from the brief. */
export function Container({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`fm-container ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * A full-width band. `tone` sets the surface so the LIGHT → LIGHT → DARK
 * section rhythm the brief asks for is declared at the call site and visible
 * when you skim the page file.
 */
export function Section({
  as: Tag = 'section',
  tone = 'light', // light | bone | dark | void
  className = '',
  pad = 'lg', // none | sm | md | lg | xl
  id,
  children,
  ...rest
}) {
  const tones = {
    light: 'surface-light',
    bone: 'surface-bone',
    dark: 'surface-dark on-dark',
    void: 'surface-void on-dark',
  }
  const pads = {
    none: '',
    sm: 'py-14 md:py-20',
    md: 'py-20 md:py-28',
    lg: 'py-24 md:py-36',
    xl: 'py-28 md:py-44',
  }

  return (
    <Tag
      id={id}
      className={`relative ${tones[tone]} ${pads[pad]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ===========================================================================
   REVEAL
   =========================================================================== */

/**
 * Wraps children in the CSS reveal. One IntersectionObserver per block,
 * disconnected after it fires.
 *
 * variant: 'up' (default) | 'mask' (clip wipe) | 'line' (scaleX hairline)
 */
export function RevealOnScroll({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  y,
  className = '',
  children,
  ...rest
}) {
  const [ref, inView] = useInView()

  const style = {
    '--reveal-delay': `${delay}ms`,
    ...(y != null ? { '--reveal-y': `${y}px` } : null),
  }

  /*
    'mask' collapses the box with clip-path and 'line' collapses it with
    scaleX(0). Either one zeroes the element's intersection rect, so an
    observer on that same node would never fire and the reveal would wait on
    itself forever. For those two the observed element stays untransformed and
    an inner wrapper carries the animation. 'up' only touches opacity and
    translate, which leave the intersection rect intact, so it needs no wrapper.
  */
  if (variant === 'mask' || variant === 'line') {
    const inner = variant === 'mask' ? 'reveal-mask' : 'reveal-line'
    return (
      <Tag ref={ref} className={className} {...rest}>
        <span className={`block ${inner} ${inView ? 'is-in' : ''}`} style={style}>
          {children}
        </span>
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Reveals its children one after another without needing a delay per child. */
export function RevealGroup({ step = 90, start = 0, className = '', children, ...rest }) {
  return (
    <div className={className} {...rest}>
      {Children.toArray(children).map((child, i) =>
        isValidElement(child)
          ? cloneElement(child, { key: i, delay: start + i * step })
          : child
      )}
    </div>
  )
}

/* ===========================================================================
   TYPOGRAPHY
   =========================================================================== */

/** The letterspaced caps label, with the short red tick before it. */
export function Eyebrow({ children, tone = 'red', className = '', rule = true }) {
  const colors = { red: 'text-red', light: 'text-white/70', dark: 'text-ash' }
  return (
    <p className={`t-eyebrow flex items-center gap-3 ${colors[tone]} ${className}`}>
      {rule && <span aria-hidden className="h-px w-6 bg-current opacity-60" />}
      {children}
    </p>
  )
}

/**
 * Section heading with optional red-accented words.
 *
 * <SectionHeading accent="Direct Commerce">
 *   Transforming Markets with Direct Commerce
 * </SectionHeading>
 *
 * The accent substring is lifted out and painted red — this is the brief's
 * "red emphasis for important words" rule, applied declaratively so a writer
 * can change the emphasis without touching markup.
 */
export function SectionHeading({
  as: Tag = 'h2',
  size = 'h2', // hero | display | h2 | h3
  accent,
  underline = false,
  className = '',
  children,
  // Forwarded so `id` reaches the DOM — several sections point
  // aria-labelledby at these headings.
  ...rest
}) {
  const sizes = { hero: 't-hero', display: 't-display', h2: 't-h2', h3: 't-h3' }
  const text = typeof children === 'string' ? children : null

  if (!text || !accent || !text.includes(accent)) {
    return (
      <Tag className={`${sizes[size]} ${className}`} {...rest}>
        {children}
      </Tag>
    )
  }

  const [before, after] = text.split(accent)
  return (
    <Tag className={`${sizes[size]} ${className}`} {...rest}>
      {before}
      <span className={`text-red ${underline ? 'red-underline' : ''}`}>{accent}</span>
      {after}
    </Tag>
  )
}

/**
 * Hero heading that reveals line by line. Pass an array of lines; any line can
 * be `{ text, accent: true }` to be painted red.
 */
export function AnimatedHeading({
  lines = [],
  className = '',
  delay = 180,
  step = 110,
  as: Tag = 'h1',
  ...rest
}) {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <Tag ref={ref} className={`t-hero ${className}`} {...rest}>
      {lines.map((line, i) => {
        const text = typeof line === 'string' ? line : line.text
        const accent = typeof line === 'object' && line.accent
        return (
          <span
            key={i}
            className={`line-mask ${inView ? 'is-in' : ''}`}
            style={{ '--reveal-delay': `${delay + i * step}ms` }}
          >
            <span className={accent ? 'text-red' : undefined}>{text}</span>
          </span>
        )
      })}
    </Tag>
  )
}

/* ===========================================================================
   FLOW / NETWORK GRAPHICS
   =========================================================================== */

/** Animated hairline with a red pulse travelling along it. */
export function FlowLine({ vertical = false, className = '', animate = true }) {
  return (
    <span
      aria-hidden
      className={`relative block overflow-hidden ${
        vertical ? 'w-px h-full' : 'h-px w-full'
      } bg-current opacity-15 ${className}`}
    >
      {animate && (
        <span
          className={`absolute bg-red ${
            vertical ? 'left-0 w-px h-10 animate-[fm-flow-y_4.5s_linear_infinite]' : 'top-0 h-px w-10'
          }`}
          style={
            vertical
              ? undefined
              : { animation: 'fm-flow-x 4.5s linear infinite' }
          }
        />
      )}
    </span>
  )
}

/**
 * The dotted-network / grid field used behind dark sections.
 * Pure CSS — no canvas, so it costs nothing on mobile.
 */
export function NetworkBackdrop({
  variant = 'grid', // grid | dots | both
  glow = true,
  fade = true,
  className = '',
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {(variant === 'grid' || variant === 'both') && (
        <div className={`absolute inset-0 bg-grid ${fade ? 'mask-fade' : ''}`} />
      )}
      {(variant === 'dots' || variant === 'both') && (
        <div className={`absolute inset-0 bg-dots ${fade ? 'mask-fade' : ''}`} />
      )}
      {glow && (
        <div className="glow-red absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-45" />
      )}
    </div>
  )
}

/* ===========================================================================
   MISC
   =========================================================================== */

/** 01 / 02 / 03 index numeral used by the editorial blocks. */
export function IndexNumeral({ children, className = '' }) {
  return (
    <span className={`t-mono-num text-chalk select-none ${className}`} aria-hidden>
      {children}
    </span>
  )
}

/** A stat in the dark opportunity strip. */
export function MetricBlock({ icon, value, label, className = '' }) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {icon && <span className="mt-0.5 shrink-0 text-red">{icon}</span>}
      <div>
        <p className="text-base font-bold leading-tight md:text-lg">{value}</p>
        <p className="mt-1 text-xs text-mist">{label}</p>
      </div>
    </div>
  )
}
