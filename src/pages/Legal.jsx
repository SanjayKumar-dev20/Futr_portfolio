import PageHero from '../components/sections/PageHero'
import { Container, RevealOnScroll, Section } from '../components/system'
import { useSeo } from '../lib/seo'

/**
 * Privacy / Terms.
 *
 * Structure only. The actual clauses have to come from the client's legal
 * position — jurisdiction, data controller, retention, governing law — and
 * inventing them would be worse than an honest placeholder.
 */
export function Privacy() {
  useSeo({
    title: 'Privacy Policy | Futr Markets',
    description: 'How Futr Markets handles personal data.',
    path: '/privacy',
  })
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        'Who we are and how to reach us',
        'What data we collect, and when',
        'Why we process it, and on what lawful basis',
        'Who we share it with',
        'How long we keep it',
        'Your rights, and how to exercise them',
        'Cookies and analytics',
        'Changes to this policy',
      ]}
    />
  )
}

export function Terms() {
  useSeo({
    title: 'Terms of Use | Futr Markets',
    description: 'Terms governing use of the Futr Markets website.',
    path: '/terms',
  })
  return (
    <LegalPage
      title="Terms of Use"
      sections={[
        'Acceptance of these terms',
        'Use of the site',
        'Intellectual property',
        'Product information and availability',
        'Enquiries and partnership applications',
        'Limitation of liability',
        'Governing law and jurisdiction',
        'Contact',
      ]}
    />
  )
}

function LegalPage({ title, sections }) {
  return (
    <>
      <PageHero eyebrow="Legal" lines={[title]} />

      <Section tone="light" pad="lg">
        <Container>
          <div className="max-w-[46rem]">
            <RevealOnScroll>
              <p className="t-body text-ash">
                This page is structured and ready. The clauses themselves need
                to come from Futr Markets' legal position — jurisdiction, data
                controller, retention periods and governing law — so they are
                listed here as headings rather than invented.
              </p>
            </RevealOnScroll>

            <ol className="mt-10 border-t border-rule">
              {sections.map((heading, i) => (
                <RevealOnScroll
                  as="li"
                  key={heading}
                  delay={i * 60}
                  className="flex gap-6 border-b border-rule py-5"
                >
                  <span aria-hidden className="shrink-0 text-[0.8125rem] font-bold tabular-nums text-chalk">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[0.9375rem] font-semibold">{heading}</span>
                </RevealOnScroll>
              ))}
            </ol>
          </div>
        </Container>
      </Section>
    </>
  )
}
