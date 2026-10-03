import { Container, RevealOnScroll, Section } from '../../../components/system'
import SectionIntro from '../../../components/sections/SectionIntro'
import { PrimaryCTA } from '../../../components/buttons'
import SystemDiagram from '../../../components/graphics/SystemDiagram'
import { IconChart, IconCube, IconTruck } from '../../../components/icons'

/**
 * Section 04 — A Complete System for Real Market Outcomes.
 *
 * The three system labels sit on their own connector rail above the diagram,
 * exactly as in the comp: a hairline with red nodes, each dropping a short
 * tick down toward the cluster it names.
 */

const SYSTEMS = [
  { label: ['Product', 'System'], Icon: IconCube },
  { label: ['Supply', 'System'], Icon: IconTruck },
  { label: ['Market', 'System'], Icon: IconChart },
]

export default function CompleteSystem() {
  return (
    <Section tone="light" pad="lg" aria-labelledby="system-heading" className="overflow-hidden">
      {/* faint grid behind the whole band */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-ink">
        <div className="absolute inset-0 bg-grid-fine mask-fade opacity-60" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <SectionIntro
            className="lg:col-span-5"
            heading="A Complete System for Real Market Outcomes."
            headingId="system-heading"
            headingClassName="mt-0 max-w-[16ch]"
            body="Futr Markets operates as a system — connecting manufacturers, products, supply and markets through direct, efficient and transparent systems."
            bodyClassName="max-w-[44ch]"
          >
            <PrimaryCTA to="/difference" size="lg">
              Explore the Difference
            </PrimaryCTA>
          </SectionIntro>

          {/* Diagram + connector rail */}
          <div className="lg:col-span-7">
            {/* Rail */}
            {/* The rail is inset to roughly the span of the three clusters in
                the diagram below, so each label sits over what it names. */}
            <RevealOnScroll delay={120} className="mb-2 px-[6%] md:px-[10%]">
              <div className="relative">
                <span aria-hidden className="absolute left-[16%] right-[16%] top-[13px] h-px bg-red/35" />
                <ul className="relative grid grid-cols-3">
                  {SYSTEMS.map(({ label, Icon }) => (
                    <li key={label.join(' ')} className="flex flex-col items-center text-center">
                      <span className="grid h-7 w-7 place-items-center rounded-full border border-red/45 bg-paper text-red">
                        <Icon size={15} />
                      </span>
                      <span aria-hidden className="h-5 w-px bg-red/35" />
                      <span className="t-eyebrow leading-[1.5] text-ink">
                        {label.map((l) => (
                          <span key={l} className="block">
                            {l}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>

            <SystemDiagram className="-mt-2" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
