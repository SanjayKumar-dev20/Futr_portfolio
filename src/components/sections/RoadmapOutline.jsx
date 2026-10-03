import {
  Container,
  Eyebrow,
  RevealOnScroll,
  Section,
  SectionHeading,
} from '../system'
import { PrimaryCTA, SecondaryCTA } from '../buttons'

/**
 * Interior-page placeholder.
 *
 * Home is the client approval checkpoint — the brief is explicit that the
 * design system should be signed off on one page before seven more are built
 * against it. So these routes are live and navigable, carry their real hero
 * and real copy, and list the sections that are already specified for them,
 * rather than shipping seven pages that may need redesigning.
 *
 * Replacing one of these is a matter of swapping <RoadmapOutline/> for real
 * sections; the hero above it stays.
 */
export default function RoadmapOutline({ eyebrow = 'In production', items = [], cta }) {
  return (
    <Section tone="bone" pad="lg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <RevealOnScroll>
              <Eyebrow>{eyebrow}</Eyebrow>
            </RevealOnScroll>
            <RevealOnScroll delay={90}>
              <SectionHeading size="h2" className="mt-5 max-w-[16ch]">
                This page is next in the build.
              </SectionHeading>
            </RevealOnScroll>
            <RevealOnScroll delay={160}>
              <p className="mt-5 max-w-[42ch] t-body text-ash">
                The design system is signed off on the home page first, then
                applied here — so the layout, motion and type you approve once
                carry across every page without a redesign.
              </p>
            </RevealOnScroll>

            {cta && (
              <RevealOnScroll delay={240}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryCTA to={cta.to} size="md">
                    {cta.label}
                  </PrimaryCTA>
                  <SecondaryCTA to="/" size="md" tone="light">
                    Back to Base
                  </SecondaryCTA>
                </div>
              </RevealOnScroll>
            )}
          </div>

          <div className="lg:col-span-8">
            <ol className="border-t border-rule">
              {items.map((item, i) => (
                <RevealOnScroll
                  as="li"
                  key={item.title}
                  delay={80 + i * 70}
                  className="group flex gap-6 border-b border-rule py-6 md:gap-10 md:py-7"
                >
                  <span
                    aria-hidden
                    className="shrink-0 pt-0.5 text-[0.8125rem] font-bold tabular-nums text-chalk transition-colors duration-500 group-hover:text-red"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="t-h3">{item.title}</h3>
                    {item.body && <p className="mt-2 max-w-[56ch] t-small text-ash">{item.body}</p>}
                  </div>
                </RevealOnScroll>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  )
}
