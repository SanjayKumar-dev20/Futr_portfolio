/**
 * Futr Markets wordmark.
 *
 * Reconstructed from the client's logo PDF (Canva export). The PDF embeds
 * Montserrat-Bold for "Futr" and Montserrat-Light for "MARKETS", and the dot
 * plate decodes to #FF0B2A on #000000 — so this is set in live Montserrat at
 * the measured proportions rather than traced as paths. That keeps it crisp at
 * every size and lets the dark/light variants swap colour cleanly.
 *
 * Proportions taken off the artwork (566 × 336 px source):
 *   "Futr"     cap height ≈ 112px, sits at x=78
 *   dot        r ≈ 20px, centred at (477, 165)
 *   "MARKETS"  ≈ 46px, tracking ≈ 0.18em, baseline 264
 */
export default function Logo({
  variant = 'dark', // 'dark' = black wordmark for light backgrounds
  className = '',
  height = 34,
  title = 'Futr Markets',
}) {
  const word = variant === 'light' ? '#FFFFFF' : '#000000'

  return (
    <svg
      viewBox="0 0 566 336"
      height={height}
      width={(566 / 336) * height}
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      <text
        x="74"
        y="186"
        fill={word}
        fontFamily="'Montserrat Variable', Montserrat, sans-serif"
        fontWeight="700"
        fontSize="166"
        letterSpacing="-6"
      >
        Futr
      </text>

      {/* the Futr dot — the only red in the mark */}
      <circle cx="477" cy="165" r="21" fill="#FF0B2A" />

      <text
        x="78"
        y="268"
        fill={word}
        fontFamily="'Montserrat Variable', Montserrat, sans-serif"
        fontWeight="300"
        fontSize="68"
        letterSpacing="12"
      >
        MARKETS
      </text>
    </svg>
  )
}

/** Compact square mark for tight spots (mobile nav, favicons, avatars). */
export function LogoMark({ className = '', size = 32, variant = 'dark' }) {
  const fg = variant === 'light' ? '#FFFFFF' : '#000000'
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="Futr Markets"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14 10h27v10H25.5v10H38v10H25.5v14H14z" fill={fg} />
      <circle cx="47" cy="44" r="7" fill="#FF0B2A" />
    </svg>
  )
}
