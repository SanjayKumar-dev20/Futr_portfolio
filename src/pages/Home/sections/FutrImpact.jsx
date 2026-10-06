import { Container, RevealOnScroll, Section } from '../../../components/system'
import SectionIntro from '../../../components/sections/SectionIntro'
import { CircleArrow } from '../../../components/buttons'
import { IconCube, IconNetwork, IconTruck } from '../../../components/icons'
import HOME from '../../../data/content/home'

/**
 * Section 03 — The Futr Impact.
 *
 * Editorial blocks, not a card grid: the oversized index numeral leads, the
 * icon sits beside it, and the copy hangs below.
 *
 * Layout note. The heading used to take a sticky 4-of-12 column with the three
 * blocks crammed into the remaining 8, which left each card around 275px wide.
 * At that measure a two-word title like "Optimized Products" broke onto three
 * lines and the body copy ran four words to a line — the client's "cards shrink
 * into small, isolated boxes". The intro now runs across the top as a lead
 * (heading left, supporting paragraph right, so the band is not half empty) and
 * the blocks get the full measure underneath, which is about 420px each. Titles
 * land on the two lines they were written for.
 */

/** Copy comes from the Creative Framework (pages 12–13); icons are ours. */
const ICONS = [IconCube, IconTruck, IconNetwork]

export default function FutrImpact() {
  const { impact } = HOME

  return (
    <Section tone="bone" pad="lg" aria-labelledby="impact-heading">
      <Container>
        {/* Lead: heading and its paragraph side by side, baselines aligned. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionIntro
            className="lg:col-span-6"
            eyebrow={impact.eyebrow}
            headingLines={impact.headingLines}
            headingId="impact-heading"
          />
          <RevealOnScroll delay={180} className="lg:col-span-6 lg:col-start-7 lg:pb-1">
            <p className="max-w-[62ch] t-body text-ash">{impact.body}</p>
          </RevealOnScroll>
        </div>

        {/* Blocks. `fm-autogrid` rather than a column count, so the cards hold
            their minimum measure as the viewport (or the zoom level) changes. */}
        <div className="fm-autogrid mt-14 md:mt-16">
          {impact.blocks.map(({ title, body, to }, i) => {
            const Icon = ICONS[i]
            return (
              <RevealOnScroll key={title.join(' ')} delay={140 + i * 110} className="h-full">
                <article className="card-edge group flex h-full flex-col p-8 md:p-9">
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

                  {/* Title tight, body given room — the hierarchy the Canva
                      reference asks for, not three evenly-spaced lines. */}
                  <h3 className="mt-10 t-card-title">
                    {title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>

                  <p className="mt-5 max-w-[46ch] t-small text-ash">{body}</p>

                  <div className="mt-auto flex justify-end pt-8">
                    <CircleArrow to={to} tone="red" size={38} aria-label={title.join(' ')} />
                  </div>
                </article>
              </RevealOnScroll>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
