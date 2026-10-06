import PageHero from '../../components/sections/PageHero'
import SectionIntro from '../../components/sections/SectionIntro'
import { OutcomeList } from '../../components/sections/blocks'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { PrimaryCTA } from '../../components/buttons'
import ImageFrame from '../../components/media/ImageFrame'
import { PRODUCT_CATEGORIES, PRODUCTS } from '../../data/products'
import IMAGES from '../../data/images'
import { useSeo } from '../../lib/seo'

/**
 * Shop.
 *
 * The Creative Framework is explicit on scope (page 10): "No e-commerce or
 * payment gateway integration in Phase 1" and "no real-time stock or pricing
 * automation". So this is a catalogue with an enquiry path, not a store.
 *
 * The product list itself is a client deliverable and ships empty — the page
 * shows the categories the catalogue will carry until `src/data/products.js`
 * is populated, at which point the grid takes over.
 */
export default function Shop() {
  useSeo({
    title: 'Shop — Products Built for Real Business Growth | Futr Markets',
    description:
      'Standardized, tested and cost-engineered products supplied directly to businesses — lower costs, transparent pricing, no middlemen.',
    path: '/shop',
  })

  const hasProducts = PRODUCTS.length > 0

  return (
    <>
      <PageHero
        eyebrow="Shop"
        lines={['Lower Costs.', { text: 'Higher Quality.', accent: true }]}
        body="Direct supply. Transparent pricing. Products built for real business growth."
      >
        <PrimaryCTA to="/talk" size="lg">
          Enquire about products
        </PrimaryCTA>
      </PageHero>

      {/* ── What makes a Futr product ────────────────────────────────── */}
      <Section tone="light" pad="lg" aria-labelledby="product-standard">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Explicit lines rather than a `max-w` in `ch`. "Cost-engineered."
                carries a real hyphen, which the browser treats as a legal break
                point — so left to the measure it split as "Tested. Cost-" /
                "engineered." One word, two lines, mid-compound. */}
            <SectionIntro
              className="lg:col-span-5"
              eyebrow="The product standard"
              headingLines={['Standardized.', 'Tested.', 'Cost-engineered.']}
              headingId="product-standard"
              body="Every Futr product is built to deliver consistent quality and measurable value — helping businesses get more from every purchase."
              bodyClassName="max-w-[44ch]"
            />

            <div className="lg:col-span-6 lg:col-start-7">
              {/* Packaging line rather than a shop floor: the heading is about
                  the product standard, so the picture is where the standard is
                  actually applied. The corner-grocery shot this replaced was
                  the one the client's review flagged. */}
              <ImageFrame
                src={IMAGES.packagingWarehouse.src}
                alt={IMAGES.packagingWarehouse.alt}
                ratio="16/10"
                rule
              />
              <OutcomeList
                className="mt-10"
                items={[
                  'Specification, packaging and quality standardized across every line.',
                  'Cost engineered at source, not discounted after the fact.',
                  'Supplied direct — no layer between the producer and your shelf.',
                  'Consistent availability through structured supply routes.',
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Catalogue ────────────────────────────────────────────────── */}
      <Section tone="bone" pad="lg" aria-labelledby="catalogue">
        <Container>
          <SectionIntro
            className="max-w-[46rem]"
            eyebrow={hasProducts ? 'All products' : 'The catalogue'}
            heading={
              hasProducts
                ? 'Everything currently supplied.'
                : 'Consumables and essentials, category by category.'
            }
            headingId="catalogue"
            headingSize="h2"
            headingClassName="max-w-[20ch]"
            body={
              hasProducts
                ? undefined
                : 'The full catalogue is being prepared with the client. These are the categories it will cover — tell us what you buy today and we will tell you what we can supply.'
            }
            bodyClassName="max-w-[56ch]"
          />

          {hasProducts ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product, i) => (
                <RevealOnScroll key={product.slug} delay={i * 80}>
                  <article className="card-edge group h-full overflow-hidden">
                    <ImageFrame src={product.image} alt={product.name} ratio="4/3" />
                    <div className="p-6">
                      <p className="t-eyebrow text-red">{product.category}</p>
                      <h3 className="mt-3 t-h3">{product.name}</h3>
                      <p className="mt-2 t-small text-ash">{product.application}</p>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <ul
              className="fm-tiles mt-14 bg-rule"
              style={{ '--fm-tile-min': '20rem', '--fm-tile-cols': 3 }}
            >
              {PRODUCT_CATEGORIES.map((category, i) => (
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
          )}

          <RevealOnScroll delay={200}>
            <div className="mt-14 border-t border-rule pt-10">
              <p className="max-w-[50ch] t-body text-ash">
                Phase one is a catalogue and an enquiry, not a checkout. Tell us
                your categories and volumes and we will come back with what we
                can supply and at what price.
              </p>
              <PrimaryCTA to="/talk" size="lg" className="mt-7">
                Enquire about products
              </PrimaryCTA>
            </div>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  )
}
