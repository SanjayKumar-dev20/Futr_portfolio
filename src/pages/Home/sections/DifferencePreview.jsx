import { Container, RevealOnScroll, Section } from '../../../components/system'
import SectionIntro from '../../../components/sections/SectionIntro'
import { PrimaryCTA } from '../../../components/buttons'
import { useInView } from '../../../hooks'
import { riseIn } from '../../../lib/motion'
import HOME from '../../../data/content/home'

/**
 * Home section 04 — The Futr Difference preview.
 *
 * The framework describes the value chain as a sequence (sourcing → product →
 * packaging → supply → delivery → market), so this renders it as one rather
 * than as another card row. The connecting rail fills on entry, which is the
 * brief's "animated connections" without turning into decoration.
 */
const CHAIN = ['Sourcing', 'Product', 'Packaging', 'Supply', 'Delivery', 'Market']

export default function DifferencePreview() {
  const { difference } = HOME
  const [ref, inView] = useInView({ threshold: 0.15 })

  return (
    <Section tone="void" pad="lg" className="overflow-hidden grain" aria-labelledby="diff-preview">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-25 mask-fade" />
        <div className="glow-red absolute right-[14%] top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 opacity-30" />
      </div>

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <SectionIntro
            className="lg:col-span-6"
            eyebrow={difference.eyebrow}
            heading={difference.heading}
            headingId="diff-preview"
            headingClassName="max-w-[16ch]"
            body={difference.body}
            bodyClassName="max-w-[50ch]"
            tone="dark"
          >
            <PrimaryCTA to={difference.cta.to} size="lg">
              {difference.cta.label}
            </PrimaryCTA>
          </SectionIntro>

          <div className="lg:col-span-5 lg:col-start-8">
            <RevealOnScroll delay={120}>
              <p className="max-w-[46ch] t-small text-white/55">{difference.body2}</p>
            </RevealOnScroll>

            {/* The chain */}
            <ol ref={ref} className="relative mt-12 pl-7">
              <span aria-hidden className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px bg-white/12" />
              <span
                aria-hidden
                className="absolute left-[3px] top-2 w-px origin-top bg-red"
                style={{
                  height: 'calc(100% - 1rem)',
                  transform: `scaleY(${inView ? 1 : 0})`,
                  transition: 'transform 1.6s var(--ease-out-expo) 200ms',
                }}
              />

              {CHAIN.map((step, i) => (
                <li
                  key={step}
                  className="relative pb-5 last:pb-0"
                  style={riseIn(inView, 240 + i * 90, { distance: 10 })}
                >
                  <span
                    aria-hidden
                    className="absolute -left-7 top-[7px] h-[7px] w-[7px] rounded-full bg-red"
                  />
                  <span className="t-eyebrow text-white/80">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  )
}
