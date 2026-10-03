import { useRef } from 'react'
import { Container, RevealOnScroll, Section } from '../../../components/system'
import {
  IconArrowLeft,
  IconArrowRight,
  IconBasket,
  IconBottle,
  IconCutlery,
  IconDrop,
  IconGear,
  IconHome,
  IconStore,
} from '../../../components/icons'
import { CLIENTS, SECTORS } from '../../../data/clients'

/**
 * Section 06 — Trust rail.
 *
 * Two parts. The sector rail (scrollable, with arrows, as in the comp) always
 * renders. The clientele logo marquee renders only once real logos exist in
 * src/data/clients.js — see the note there on why it ships empty.
 */

const ICONS = {
  store: IconStore,
  basket: IconBasket,
  cutlery: IconCutlery,
  bottle: IconBottle,
  drop: IconDrop,
  home: IconHome,
  gear: IconGear,
}

export default function Clientele() {
  const trackRef = useRef(null)

  const nudge = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.7, 420), behavior: 'smooth' })
  }

  return (
    <Section tone="bone" pad="sm" aria-labelledby="trust-heading">
      <Container>
        <RevealOnScroll>
          <h2 id="trust-heading" className="t-eyebrow text-center text-ash">
            Trusted by businesses across diverse markets
          </h2>
        </RevealOnScroll>

        {/* ── Sector rail ───────────────────────────────────────────── */}
        <RevealOnScroll delay={90} className="mt-8">
          <div className="flex items-center gap-4">
            <ul
              ref={trackRef}
              className="flex flex-1 items-center gap-8 overflow-x-auto scroll-smooth pb-1 md:gap-10 lg:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SECTORS.map(({ label, icon }) => {
                const Icon = ICONS[icon]
                return (
                  <li
                    key={label}
                    className="group flex shrink-0 items-center gap-2.5 text-ash transition-colors duration-400 hover:text-ink"
                  >
                    <Icon size={21} className="transition-colors duration-400 group-hover:text-red" />
                    <span className="whitespace-nowrap text-[0.8125rem] font-medium">{label}</span>
                  </li>
                )
              })}
            </ul>

            <div className="hidden shrink-0 items-center gap-2 lg:flex">
              <RailButton label="Previous sectors" onClick={() => nudge(-1)}>
                <IconArrowLeft size={16} />
              </RailButton>
              <RailButton label="Next sectors" onClick={() => nudge(1)}>
                <IconArrowRight size={16} />
              </RailButton>
            </div>
          </div>
        </RevealOnScroll>

        {/* ── Clientele logos (renders only when supplied) ───────────── */}
        {CLIENTS.length > 0 && (
          <RevealOnScroll delay={150} className="mt-12">
            <p className="t-eyebrow text-center text-ash/70">Our clientele</p>
            <div className="marquee relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
              <ul
                className="marquee-track flex w-max items-center gap-16"
                style={{ '--marquee-dur': `${Math.max(28, CLIENTS.length * 6)}s` }}
              >
                {[...CLIENTS, ...CLIENTS].map((client, i) => (
                  <li key={`${client.name}-${i}`} aria-hidden={i >= CLIENTS.length}>
                    <img
                      src={client.logo}
                      alt={i < CLIENTS.length ? client.name : ''}
                      loading="lazy"
                      className="h-7 w-auto opacity-55 grayscale transition-[opacity,filter] duration-500 hover:opacity-100 hover:grayscale-0"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        )}
      </Container>
    </Section>
  )
}

function RailButton({ children, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full border border-rule text-ash transition-colors duration-400 hover:border-red hover:bg-red hover:text-white"
    >
      {children}
    </button>
  )
}
