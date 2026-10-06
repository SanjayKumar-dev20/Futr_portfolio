import { IconFactory, IconGear, IconStore, IconUsers } from '../icons'
import { useInView } from '../../hooks'
import { riseIn } from '../../lib/motion'

/* ===========================================================================
   DIRECT COMMERCE — THE FLOW
   ---------------------------------------------------------------------------
   The Futr Difference page is deliberately the one page with no photography:
   the framework asks for "flow lines, network grids or connection visuals
   instead of product shots". What it had instead was one isometric diagram and
   a lot of white — the client's review called out the blank areas directly.

   This fills them with the thing the page is actually arguing. The page says
   value should move straight from the people who make it to the people who use
   it, and that the layers in between add cost rather than value. So the graphic
   states both halves:

     top     the legacy chain, struck through and greyed — four handoffs
     bottom  the Futr route — three parties and one system between them

   Drawn as geometry and type rather than as an illustration asset, for the same
   reasons SystemDiagram is: it stays sharp at any size, it recolours from the
   brand tokens, and it costs no network request. The red rail draws itself once
   on scroll and then holds — no looping animation to sit under the copy.
   =========================================================================== */

/** What the old chain costs, in the order a product used to travel it. */
const LEGACY = ['Agent', 'Distributor', 'Wholesaler', 'Stockist']

/** The route Futr replaces it with. */
const STEPS = [
  {
    Icon: IconFactory,
    eyebrow: 'Those who make',
    title: 'Manufacturer',
    body: 'Produces to a standard specification, packaging and cost.',
  },
  {
    Icon: IconGear,
    eyebrow: 'The system',
    title: 'Futr Markets',
    body: 'Standardizes, routes and supplies — one layer, not four.',
    accent: true,
  },
  {
    Icon: IconStore,
    eyebrow: 'Those who serve',
    title: 'Business',
    body: 'Buys direct, at a price that was engineered rather than discounted.',
  },
  {
    Icon: IconUsers,
    eyebrow: 'Those who consume',
    title: 'Customer',
    body: 'Gets consistent quality without paying for the handoffs.',
  },
]

export default function DirectFlow({ className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.15 })

  return (
    <div ref={ref} className={className}>
      {/* ── The chain being replaced ───────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-x-3 gap-y-2"
        style={riseIn(inView, 0, { distance: 10 })}
      >
        <p className="t-eyebrow text-ash">What Futr removes</p>
        <span aria-hidden className="hidden h-px w-8 bg-rule sm:block" />
        <ul className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {LEGACY.map((layer, i) => (
            <li key={layer} className="flex items-center gap-2">
              <span className="rounded-full border border-rule px-3 py-1 text-xs font-medium text-ash line-through decoration-red/70 decoration-[1.5px]">
                {layer}
              </span>
              {i < LEGACY.length - 1 && (
                <span aria-hidden className="text-xs text-chalk">
                  →
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ── The route that replaces it ─────────────────────────────────── */}
      <div className="relative mt-10">
        {/*
          The rail. Horizontal from `md` up, where the steps sit in a row;
          below that the steps stack and a horizontal line through them would
          be drawing a connection that is not on screen.

          `top-[1.375rem]` is the centre of the 2.75rem node, so the line passes
          through the icons rather than above them.
        */}
        <span
          aria-hidden
          className="absolute left-0 top-[1.375rem] hidden h-px w-full bg-rule md:block"
        />
        <span
          aria-hidden
          className="absolute left-0 top-[1.375rem] hidden h-px w-full origin-left bg-red md:block"
          style={{
            transform: `scaleX(${inView ? 1 : 0})`,
            transition: 'transform 1.5s var(--ease-out-expo) 200ms',
          }}
        />

        <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
          {STEPS.map(({ Icon, eyebrow, title, body, accent }, i) => (
            <li key={title} style={riseIn(inView, 240 + i * 130)}>
              <span
                className={[
                  'relative grid h-11 w-11 place-items-center rounded-full border',
                  // The Futr node is the only filled one. It is the layer the
                  // page is arguing for, so it is the one that reads as solid.
                  accent
                    ? 'border-red bg-red text-white'
                    : 'border-rule bg-paper text-red',
                ].join(' ')}
              >
                <Icon size={20} />
              </span>

              <p className="mt-5 t-eyebrow text-ash">{eyebrow}</p>
              <h3 className={`mt-2.5 t-h3 ${accent ? 'text-red' : ''}`}>{title}</h3>
              <p className="mt-3 max-w-[32ch] t-small text-ash">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
