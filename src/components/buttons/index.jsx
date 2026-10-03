import Polymorphic from '../primitives/Polymorphic'

const Arrow = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    aria-hidden
    className={`arrow-slide shrink-0 ${className}`}
  >
    <path
      d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BASE =
  'group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold ' +
  'transition-[background-color,color,border-color,transform] duration-300 ' +
  '[transition-timing-function:var(--ease-out-quint)] active:translate-y-px ' +
  'disabled:pointer-events-none disabled:opacity-45'

const SIZES = {
  sm: 'h-9 px-4 text-[0.75rem] tracking-[0.02em]',
  md: 'h-11 px-6 text-[0.8125rem] tracking-[0.02em]',
  lg: 'h-[3.25rem] px-8 text-sm tracking-[0.02em]',
}

/** Solid Futr Red. The one and only primary action per view. */
export function PrimaryCTA({ children, size = 'md', arrow = true, className = '', ...rest }) {
  return (
    <Polymorphic
      className={`${BASE} ${SIZES[size]} bg-red text-white hover:bg-red-dark ${className}`}
      {...rest}
    >
      {children}
      {arrow && <Arrow />}
    </Polymorphic>
  )
}

/**
 * Outlined. `tone` must match the surface it sits on — there is no automatic
 * detection, because getting it wrong is a visible bug and should be explicit.
 */
export function SecondaryCTA({
  children,
  size = 'md',
  arrow = true,
  tone = 'dark', // 'dark' = for dark surfaces (white outline)
  className = '',
  ...rest
}) {
  const tones = {
    dark: 'border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink',
    light: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white',
  }
  return (
    <Polymorphic
      className={`${BASE} ${SIZES[size]} ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
      {arrow && <Arrow />}
    </Polymorphic>
  )
}

/**
 * Quiet text link with a rule that extends on hover.
 *
 * `py-1 -my-1`: the label is 13px, which makes the link itself a 20px-tall
 * target — below the 24px WCAG 2.2 asks for, and a thin thing to hit on a
 * phone, where this is the only call to action in some sections. The padding
 * grows the hit area and the matching negative margin removes the extra height
 * from the layout, so nothing shifts.
 */
export function TextLink({ children, tone = 'light', className = '', ...rest }) {
  const tones = { light: 'text-ink', dark: 'text-white' }
  return (
    <Polymorphic
      className={`group -my-1 inline-flex items-center gap-2 py-1 text-[0.8125rem] font-semibold tracking-[0.02em] ${tones[tone]} ${className}`}
      {...rest}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-red transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100"
        />
      </span>
      <Arrow className="text-red" />
    </Polymorphic>
  )
}

/**
 * The circular arrow button in the corner of the split panels in the comp.
 * `tone` controls the ring colour; it fills with red on hover.
 */
export function CircleArrow({ tone = 'dark', size = 44, className = '', ...rest }) {
  const tones = {
    dark: 'border-white/40 text-white',
    light: 'border-ink/25 text-ink',
    red: 'border-red/40 text-red',
  }
  return (
    <Polymorphic
      aria-label="Open"
      style={{ width: size, height: size }}
      className={`group inline-grid place-items-center rounded-full border transition-colors duration-400 [transition-timing-function:var(--ease-out-quint)] hover:border-red hover:bg-red hover:text-white ${tones[tone]} ${className}`}
      {...rest}
    >
      <Arrow />
    </Polymorphic>
  )
}

export { Arrow }
