import {
  Container,
  NetworkBackdrop,
  RevealOnScroll,
  Section,
} from '../../../components/system'
import SectionIntro from '../../../components/sections/SectionIntro'
import {
  IconArrowDownCircle,
  IconBolt,
  IconChart,
  IconCommunity,
} from '../../../components/icons'

/**
 * Section 05 — The Opportunity.
 *
 * The dark beat in the section rhythm. Four outcomes, one per audience, split
 * by hairline rules. Deliberately quiet: no cards, no hover lift — it is a
 * statement band, and the next section does the moving.
 */

const ITEMS = [
  { Icon: IconArrowDownCircle, value: ['Lower', 'Costs'], label: 'For Businesses' },
  { Icon: IconBolt, value: ['Faster', 'Market Access'], label: 'For Manufacturers' },
  { Icon: IconChart, value: ['More', 'Opportunities'], label: 'For Entrepreneurs' },
  { Icon: IconCommunity, value: ['Greater Value'], label: 'For Communities' },
]

export default function Opportunity() {
  return (
    <Section tone="void" pad="md" aria-labelledby="opportunity-heading" className="overflow-hidden grain">
      <NetworkBackdrop variant="grid" glow={false} />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <SectionIntro
            className="lg:col-span-4"
            eyebrow="The Opportunity"
            heading="Real Markets. Real Growth."
            headingId="opportunity-heading"
            headingSize="h2"
            headingClassName="max-w-[12ch]"
            tone="dark"
          />

          <ul className="grid grid-cols-2 gap-x-6 gap-y-9 lg:col-span-8 lg:grid-cols-4 lg:gap-x-0">
            {ITEMS.map(({ Icon, value, label }, i) => (
              <RevealOnScroll
                as="li"
                key={label}
                delay={120 + i * 90}
                className="relative lg:px-7 lg:first:pl-0"
              >
                {/* hairline divider */}
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute -left-0 top-1 hidden h-[calc(100%-0.5rem)] w-px bg-white/12 lg:block"
                  />
                )}
                <span className="block text-red">
                  <Icon size={26} />
                </span>
                <p className="mt-4 text-[1.0625rem] font-bold leading-[1.2] tracking-[-0.02em] md:text-lg">
                  {value.map((v) => (
                    <span key={v} className="block">
                      {v}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-xs text-mist">{label}</p>
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
