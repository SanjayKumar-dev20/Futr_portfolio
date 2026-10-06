import { Container, RevealOnScroll, Section } from '../../../components/system'
import SectionIntro from '../../../components/sections/SectionIntro'
import { SecondaryCTA } from '../../../components/buttons'
import HOME from '../../../data/content/home'
import { ARTICLES, PULSE_CATEGORIES } from '../../../data/articles'

/**
 * Home section 06 — Futr Pulse preview.
 *
 * The framework specifies a blog grid here, but the client has not supplied
 * articles yet (listed as an outstanding deliverable in HANDOVER.md). Rather
 * than invent posts, this shows the categories the hub will carry and links
 * through — honest, and it still occupies the section properly.
 *
 * When ARTICLES is populated the grid takes over automatically.
 */
export default function PulsePreview() {
  const { pulse } = HOME
  const hasArticles = ARTICLES.length > 0

  return (
    <Section tone="light" pad="lg" aria-labelledby="pulse-preview">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionIntro
            className="max-w-[34rem]"
            eyebrow={pulse.eyebrow}
            heading={pulse.heading}
            headingId="pulse-preview"
            headingClassName="max-w-[14ch]"
            body={pulse.body}
            bodyClassName="max-w-[48ch]"
          />
          <RevealOnScroll delay={200} className="pb-2">
            <SecondaryCTA to={pulse.cta.to} size="lg" tone="light">
              {pulse.cta.label}
            </SecondaryCTA>
          </RevealOnScroll>
        </div>

        {hasArticles ? (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ARTICLES.slice(0, 3).map((article, i) => (
              <RevealOnScroll key={article.slug} delay={i * 100}>
                <article className="card-edge h-full p-7">
                  <p className="t-eyebrow text-red">{article.category}</p>
                  <h3 className="mt-4 t-h3">{article.title}</h3>
                  <p className="mt-3 t-small text-ash">{article.excerpt}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <ul
            className="fm-tiles mt-14 bg-rule"
            style={{ '--fm-tile-min': '20rem', '--fm-tile-cols': 3 }}
          >
            {PULSE_CATEGORIES.map((category, i) => (
              <RevealOnScroll
                as="li"
                key={category.name}
                delay={i * 70}
                className="surface-light p-7"
              >
                <p className="t-eyebrow text-chalk">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-4 t-h3">{category.name}</h3>
                <p className="mt-2 t-small text-ash">{category.blurb}</p>
              </RevealOnScroll>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  )
}
