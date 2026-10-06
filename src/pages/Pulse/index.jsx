import PageHero from '../../components/sections/PageHero'
import SectionIntro from '../../components/sections/SectionIntro'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { PrimaryCTA } from '../../components/buttons'
import { ARTICLES, PULSE_CATEGORIES } from '../../data/articles'
import { useSeo } from '../../lib/seo'

/**
 * Futr Pulse.
 *
 * The framework (page 14) gives this page its hero and a blog grid, but names
 * written content as a Futr Markets deliverable — so the articles are not ours
 * to invent. Until `src/data/articles.js` is populated the page shows the
 * categories the hub will carry and says plainly that the first pieces are
 * coming; the grid takes over automatically once entries exist.
 */
export default function Pulse() {
  useSeo({
    title: 'Futr Pulse — Insights That Move Markets | Futr Markets',
    description:
      'Explore ideas, innovations and updates shaping the future of trade — straight from the Futr Markets ecosystem.',
    path: '/pulse',
  })

  const hasArticles = ARTICLES.length > 0
  const [featured, ...rest] = ARTICLES

  return (
    <>
      <PageHero
        eyebrow="Futr Pulse"
        lines={['Insights That', { text: 'Move Markets.', accent: true }]}
        body="Explore ideas, innovations and updates shaping the future of trade — straight from the Futr Markets ecosystem."
      />

      {hasArticles ? (
        <>
          {/* Featured */}
          <Section tone="light" pad="lg">
            <Container>
              <RevealOnScroll>
                <article className="group">
                  <p className="t-eyebrow text-red">{featured.category}</p>
                  <h2 className="mt-5 max-w-[20ch] t-display">{featured.title}</h2>
                  <p className="mt-5 max-w-[60ch] t-body text-ash">{featured.excerpt}</p>
                </article>
              </RevealOnScroll>
            </Container>
          </Section>

          {/* Grid */}
          <Section tone="bone" pad="lg">
            <Container>
              <div className="grid gap-6 md:grid-cols-3">
                {rest.map((article, i) => (
                  <RevealOnScroll key={article.slug} delay={i * 90}>
                    <article className="card-edge h-full p-7">
                      <p className="t-eyebrow text-red">{article.category}</p>
                      <h3 className="mt-4 t-h3">{article.title}</h3>
                      <p className="mt-3 t-small text-ash">{article.excerpt}</p>
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </Container>
          </Section>
        </>
      ) : (
        <Section tone="bone" pad="lg" aria-labelledby="pulse-categories">
          <Container>
            <SectionIntro
              className="max-w-[46rem]"
              eyebrow="What the hub will carry"
              heading="Six lines of thinking, published as they become useful."
              headingId="pulse-categories"
              headingSize="h2"
              headingClassName="max-w-[20ch]"
              body="Futr Pulse is for operators — what we are seeing in supply, pricing, demand and distribution. It publishes when there is something worth saying, not on a content calendar."
              bodyClassName="max-w-[56ch]"
            />

            <ul
              className="fm-tiles mt-14 bg-rule"
              style={{ '--fm-tile-min': '20rem', '--fm-tile-cols': 3 }}
            >
              {PULSE_CATEGORIES.map((category, i) => (
                <RevealOnScroll
                  as="li"
                  key={category.name}
                  delay={i * 70}
                  className="surface-bone p-7"
                >
                  <p className="t-eyebrow text-chalk">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 t-h3">{category.name}</h3>
                  <p className="mt-2 t-small text-ash">{category.blurb}</p>
                </RevealOnScroll>
              ))}
            </ul>

            <RevealOnScroll delay={200}>
              <div className="mt-14 border-t border-rule pt-10">
                <p className="max-w-[48ch] t-body text-ash">
                  Want to be told when the first pieces go up? Say so and we will
                  add you to the list.
                </p>
                <PrimaryCTA to="/talk" size="lg" className="mt-7">
                  Talk to Us
                </PrimaryCTA>
              </div>
            </RevealOnScroll>
          </Container>
        </Section>
      )}
    </>
  )
}
