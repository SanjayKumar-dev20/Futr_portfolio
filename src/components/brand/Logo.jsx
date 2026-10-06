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
 *
 * ── On the viewBox ────────────────────────────────────────────────────────
 * The source artboard is 566 × 336 with generous bleed, and the mark only
 * occupies the middle ~61% of it. Rendering that box at `height={36}` therefore
 * drew a wordmark about 22px tall — the navbar logo the client reported as too
 * small to read on a 1440p display. Shrinking it further would not help; the
 * problem was never the height attribute, it was that most of the height was
 * empty.
 *
 * So the viewBox is cropped to the ink. The numbers below are measured off the
 * live render (getBBox, minus the font's ascent/descent padding, plus a small
 * optical margin) rather than eyeballed:
 *
 *   x  74 → 498   ("Futr" left stem → right edge of the dot)
 *   y  62 → 268   ("t" ascender → "MARKETS" baseline)
 *
 * Same artwork, same proportions, ~53% more apparent size at any given
 * `height`. The constant is exported because the favicon and the OG-image
 * script need to crop to the same box.
 */
export const LOGO_VIEWBOX = { x: 68, y: 55, w: 436, h: 220 }

const VB = `${LOGO_VIEWBOX.x} ${LOGO_VIEWBOX.y} ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`
const ASPECT = LOGO_VIEWBOX.w / LOGO_VIEWBOX.h

export default function Logo({
  variant = 'dark', // 'dark' = black wordmark for light backgrounds
  className = '',
  height = 34,
  title = 'Futr Markets',
}) {
  const word = variant === 'light' ? '#FFFFFF' : '#000000'

  return (
    <svg
      viewBox={VB}
      height={height}
      width={ASPECT * height}
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
