/**
 * The wireframe globe, generated once.
 *
 * This geometry existed twice: as `DottedGlobe` in the footer and as
 * `StaticNetwork` in the scenes folder. Both built the same latitude and
 * longitude ellipses and the same golden-angle node field, with slightly
 * different constants and two sets of bugs to keep in sync. The two call sites
 * wanted different *styling*, not different geometry — so the geometry lives
 * here and the differences are props.
 *
 * Deterministic by construction (golden-angle spiral, no RNG): a hero mark that
 * reshuffles on every load reads as noise rather than infrastructure.
 */

const GOLDEN_ANGLE = 137.508

const buildNodes = (count, radius) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i * GOLDEN_ANGLE * Math.PI) / 180
    const r = radius * Math.sqrt((i + 0.5) / count)
    return {
      x: 100 + r * Math.cos(angle),
      y: 100 + r * Math.sin(angle),
      accent: i % 7 === 0,
    }
  })

const latitudeRings = (lats, radius) =>
  lats.map((lat) => {
    const rad = (lat * Math.PI) / 180
    return {
      key: lat,
      cx: 100,
      cy: 100 + radius * Math.sin(rad),
      rx: Math.max(radius * Math.cos(rad), 1),
      ry: Math.max(radius * Math.cos(rad) * 0.17, 0.4),
    }
  })

const longitudeRings = (longs, radius) =>
  longs.map((lon) => ({
    key: lon,
    cx: 100,
    cy: 100,
    rx: Math.max(radius * Math.abs(Math.cos((lon * Math.PI) / 180)), 0.4),
    ry: radius,
  }))

const RADIUS = 96

/**
 * `variant` picks a presentation, not a shape:
 *   'hero'   — filled body, red meridians, haloed nodes (hero fallback)
 *   'mark'   — hairline only, tuned to sit behind footer text
 */
export default function WireGlobe({
  variant = 'hero',
  className = '',
  nodeCount = 30,
  lats = [-64, -42, -21, 0, 21, 42, 64],
  longs = [0, 26, 52, 78, 104, 130, 156],
  id = 'fm-globe',
}) {
  const nodes = buildNodes(nodeCount, RADIUS - 1)
  const isHero = variant === 'hero'

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden>
      {isHero && (
        <defs>
          <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#FF0B2A" stopOpacity="0" />
            <stop offset="100%" stopColor="#FF0B2A" stopOpacity="0.4" />
          </radialGradient>
        </defs>
      )}

      {isHero ? (
        <>
          <circle cx="100" cy="100" r={RADIUS + 3} fill={`url(#${id}-halo)`} />
          <circle cx="100" cy="100" r={RADIUS} fill="#060607" />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            stroke="#FF0B2A"
            strokeOpacity="0.3"
            strokeWidth="0.5"
          />
        </>
      ) : (
        <circle cx="100" cy="100" r={RADIUS} stroke="currentColor" strokeWidth="0.6" />
      )}

      {latitudeRings(lats, RADIUS).map((r) => (
        <ellipse
          key={`lat-${r.key}`}
          cx={r.cx}
          cy={r.cy}
          rx={r.rx}
          ry={r.ry}
          stroke={isHero ? '#FF0B2A' : 'currentColor'}
          strokeOpacity={isHero ? 0.22 : 1}
          strokeWidth={isHero ? 0.45 : 0.5}
        />
      ))}

      {longitudeRings(longs, RADIUS).map((r) => (
        <ellipse
          key={`lon-${r.key}`}
          cx={r.cx}
          cy={r.cy}
          rx={r.rx}
          ry={r.ry}
          stroke={isHero ? '#FFFFFF' : 'currentColor'}
          strokeOpacity={isHero ? 0.09 : 1}
          strokeWidth={isHero ? 0.45 : 0.5}
        />
      ))}

      {nodes.map((n, i) =>
        isHero ? (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="2.6" fill="#FF0B2A" opacity="0.18" />
            <circle cx={n.x} cy={n.y} r="1.1" fill="#FF2F46" />
          </g>
        ) : (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.accent ? 1.5 : 0.8}
            fill={n.accent ? '#FF0B2A' : 'currentColor'}
            opacity={n.accent ? 0.75 : 1}
          />
        )
      )}
    </svg>
  )
}
