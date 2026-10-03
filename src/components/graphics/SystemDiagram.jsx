import { useInView } from '../../hooks'

/* ===========================================================================
   ISOMETRIC MARKET SYSTEM
   ---------------------------------------------------------------------------
   The comp shows an isometric city — factories on the left, transit through
   the middle, retail on the right, with a red route threading all three.

   Drawn as geometry rather than sourced as an illustration, for three reasons:
   it stays sharp at any size, it is themeable with the brand tokens, and the
   brief asks for "abstract market infrastructure" rather than a picture of a
   city. The red route animates once, on scroll, then holds.
   =========================================================================== */

/** Standard 2:1 isometric projection. z lifts the point up the screen. */
const SX = 0.866
const SY = 0.5
const iso = (x, y, z = 0) => [(x - y) * SX, (x + y) * SY - z]

const fmt = (pts) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')

/** One extruded block: top face + the two faces that face the camera. */
function Block({ x, y, w, d, h, tone = 0 }) {
  // Three shades per block so volume reads without any lighting model.
  const top = ['#FFFFFF', '#F2F2EF', '#E8E8E4'][tone]
  const right = ['#D9D9D4', '#CFCFC9', '#C4C4BE'][tone]
  const left = ['#B6B6B0', '#ABABA5', '#A0A09A'][tone]

  const topFace = [
    iso(x, y, h),
    iso(x + w, y, h),
    iso(x + w, y + d, h),
    iso(x, y + d, h),
  ]
  const rightFace = [
    iso(x + w, y, h),
    iso(x + w, y + d, h),
    iso(x + w, y + d, 0),
    iso(x + w, y, 0),
  ]
  const leftFace = [
    iso(x, y + d, h),
    iso(x + w, y + d, h),
    iso(x + w, y + d, 0),
    iso(x, y + d, 0),
  ]

  return (
    <g>
      <polygon points={fmt(leftFace)} fill={left} />
      <polygon points={fmt(rightFace)} fill={right} />
      <polygon points={fmt(topFace)} fill={top} />
      <polygon
        points={fmt(topFace)}
        fill="none"
        stroke="#0A0A0B"
        strokeOpacity="0.1"
        strokeWidth="0.06"
      />
    </g>
  )
}

/* Left — manufacturing. Right — market. Middle — supply, kept deliberately low
   so the eye reads it as movement between two masses rather than a third one. */
const BLOCKS = [
  // manufacturing
  { x: 0.2, y: 1.0, w: 2.2, d: 2.6, h: 2.3, tone: 1 },
  { x: 0.0, y: 4.2, w: 1.9, d: 2.2, h: 1.5, tone: 2 },
  { x: 2.8, y: 0.6, w: 1.5, d: 1.7, h: 3.2, tone: 0 },
  { x: 2.7, y: 3.0, w: 2.0, d: 2.3, h: 1.1, tone: 2 },

  // supply / transit
  { x: 5.4, y: 5.6, w: 1.2, d: 2.3, h: 0.5, tone: 0 },
  { x: 7.0, y: 6.1, w: 1.0, d: 1.5, h: 0.45, tone: 1 },
  { x: 5.6, y: 8.3, w: 2.5, d: 1.1, h: 0.4, tone: 0 },

  // market
  { x: 8.8, y: 1.0, w: 2.0, d: 2.2, h: 1.9, tone: 1 },
  { x: 11.2, y: 0.7, w: 1.7, d: 1.9, h: 2.8, tone: 0 },
  { x: 8.9, y: 3.8, w: 1.5, d: 1.7, h: 1.3, tone: 2 },
]

/** The retail block that carries the FUTR fascia in the comp. */
const SIGN_BLOCK = { x: 10.9, y: 3.3, w: 2.2, d: 2.3, h: 1.8, tone: 0 }

/* The red route, in grid space. Threads manufacturing → supply → market. */
const ROUTE = [
  [1.3, 7.1],
  [4.9, 7.1],
  [4.9, 9.6],
  [9.9, 9.6],
  [9.9, 6.4],
  [13.4, 6.4],
]

/* Nodes dropped on the route where value changes hands. */
const ROUTE_NODES = [
  [4.9, 7.1],
  [9.9, 9.6],
  [9.9, 6.4],
]

export default function SystemDiagram({ className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.25 })

  const routePts = ROUTE.map(([x, y]) => iso(x, y, 0.08))
  const routeD = routePts
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ')

  // Painter's algorithm: smaller (x+y) is further away, so it is drawn first.
  const ordered = [...BLOCKS, SIGN_BLOCK].sort((a, b) => a.x + a.y - (b.x + b.y))

  const signTop = iso(SIGN_BLOCK.x, SIGN_BLOCK.y, SIGN_BLOCK.h)

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* viewBox is fitted to the projected content box rather than guessed:
          iso x spans about -8.3 → 11.1, iso y about -3 → 10. */}
      <svg
        viewBox="-9.4 -3.6 21.4 14.4"
        className="w-full"
        fill="none"
        role="img"
        aria-label="Isometric diagram: manufacturing connects through supply routes to market, along a single direct path"
      >
        {/* ── Ground plate ──────────────────────────────────────────── */}
        <defs>
          <linearGradient id="fm-plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <clipPath id="fm-plate-clip">
            <polygon points={fmt([iso(-1, -1), iso(15, -1), iso(15, 11), iso(-1, 11)])} />
          </clipPath>
        </defs>

        <g clipPath="url(#fm-plate-clip)">
          <polygon
            points={fmt([iso(-1, -1), iso(15, -1), iso(15, 11), iso(-1, 11)])}
            fill="url(#fm-plate)"
          />
          {/* isometric grid */}
          {Array.from({ length: 17 }, (_, i) => i - 1).map((i) => (
            <g key={`g${i}`} stroke="#0A0A0B" strokeOpacity="0.07" strokeWidth="0.03">
              <line
                x1={iso(i, -1)[0]}
                y1={iso(i, -1)[1]}
                x2={iso(i, 11)[0]}
                y2={iso(i, 11)[1]}
              />
            </g>
          ))}
          {Array.from({ length: 13 }, (_, i) => i - 1).map((i) => (
            <g key={`h${i}`} stroke="#0A0A0B" strokeOpacity="0.07" strokeWidth="0.03">
              <line
                x1={iso(-1, i)[0]}
                y1={iso(-1, i)[1]}
                x2={iso(15, i)[0]}
                y2={iso(15, i)[1]}
              />
            </g>
          ))}
        </g>

        {/* ── Buildings ─────────────────────────────────────────────── */}
        {ordered.map((b, i) => (
          <Block key={i} {...b} />
        ))}

        {/* FUTR fascia on the market block */}
        <g transform={`translate(${signTop[0] + 0.55} ${signTop[1] + 0.62})`}>
          <text
            transform="skewY(30) scale(1 0.92)"
            fontFamily="'Montserrat Variable', Montserrat, sans-serif"
            fontSize="0.58"
            fontWeight="800"
            letterSpacing="-0.02"
            fill="#0A0A0B"
          >
            FUTR
            <tspan fill="#FF0B2A">.</tspan>
          </text>
        </g>

        {/* ── The route ─────────────────────────────────────────────── */}
        {/* soft shadow under the line so it reads as sitting on the plate */}
        <path d={routeD} stroke="#FF0B2A" strokeOpacity="0.14" strokeWidth="0.34" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={routeD}
          stroke="#FF0B2A"
          strokeWidth="0.13"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: inView ? 0 : 1,
            transition: 'stroke-dashoffset 2.1s var(--ease-out-expo) 240ms',
          }}
        />

        {ROUTE_NODES.map(([x, y], i) => {
          const [px, py] = iso(x, y, 0.08)
          return (
            <g
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity .5s ease ${900 + i * 260}ms`,
              }}
            >
              <circle cx={px} cy={py} r="0.26" fill="#FF0B2A" fillOpacity="0.18" />
              <circle cx={px} cy={py} r="0.11" fill="#FF0B2A" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
