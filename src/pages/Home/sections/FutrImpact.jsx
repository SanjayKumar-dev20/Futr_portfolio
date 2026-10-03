import { Container, RevealOnScroll, Section } from '../../../components/system'
import SectionIntro from '../../../components/sections/SectionIntro'
import { CircleArrow } from '../../../components/buttons'
import { IconCube, IconNetwork, IconTruck } from '../../../components/icons'
import HOME from '../../../data/content/home'

/**
 * Section 03 — The Futr Impact.
 *
 * Editorial blocks, not a card grid: the oversized index numeral leads, the
 * icon sits beside it, and the copy hangs below. The brief is explicit that
 * generic three-up card grids are off-limits, so the heading takes a full
 * column of its own on the left and the three blocks run beside it.
 */

/** Copy comes from the Creative Framework (pages 12–13); icons are ours. */
const ICONS = [IconCube, IconTruck, IconNetwork]

export default function FutrImpact() {
  const { impact } = HOME

  return (
    <Section tone="bone" pad="lg" aria-labelledby="impact-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Heading column */}
          <SectionIntro
            className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
            eyebrow={impact.eyebrow}
            heading={impact.heading}
            headingId="impact-heading"
            headingClassName="max-w-[14ch]"
            body={impact.body}
            bodyClassName="max-w-[44ch]"
          />

          {/* Blocks */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-5">
            {impact.blocks.map(({ title, body, to }, i) => {
              const Icon = ICONS[i]
              return (
                <RevealOnScroll key={title.join(' ')} delay={140 + i * 110} className="h-full">
                  <article className="card-edge group flex h-full flex-col p-7 md:p-8">
                    <header className="flex items-start justify-between gap-4">
                      <span
                        aria-hidden
                        className="t-mono-num text-chalk transition-colors duration-500 group-hover:text-rule"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-1 text-red">
                        <Icon size={30} />
                      </span>
                    </header>

                    <h3 className="mt-10 t-h3">
                      {title.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>

                    <p className="mt-3 t-small text-ash">{body}</p>

                    <div className="mt-auto flex justify-end pt-8">
                      <CircleArrow to={to} tone="red" size={38} aria-label={title.join(' ')} />
                    </div>
                  </article>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
