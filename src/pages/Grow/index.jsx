import { Link } from 'react-router-dom'
import PageHero from '../../components/sections/PageHero'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { CutoutFigure } from '../../components/media/ImageFrame'
import { PrimaryCTA } from '../../components/buttons'
import IMAGES from '../../data/images'
import { useSeo } from '../../lib/seo'

/**
 * Let's Grow — the fork in the journey.
 *
 * Built out rather than stubbed, because it is only two panels and it is the
 * page that proves the cut-out-on-dark treatment works at full height, which
 * is the thing the client specifically asked to see.
 */
const BRANCHES = [
  {
    key: 'manufacturers',
    eyebrow: 'Manufacturers',
    title: ['Grow with Structure.', 'Scale with Certainty.'],
    body: 'Production flow, packaging, quality, market access and supply — structured so growth stops being a gamble.',
    to: '/manufacturers',
    cta: 'Partner with Futr',
    // A real production operator, not a studio portrait. Beyond being the
    // right subject for this panel, a busy mid-tone background is what the
    // cut-out treatment needs — a figure shot on a white seamless cannot be
    // dissolved into graphite without actual background removal.
    image: IMAGES.manufacturingMachine,
    side: 'right',
  },
  {
    key: 'futr-x',
    eyebrow: 'Futr X — Young Entrepreneurs',
    title: ['Lead New Markets.', 'Build Your Opportunity.'],
    body: 'Regional distribution, category growth, product systems and logistics support for people building their own market.',
    to: '/futr-x',
    cta: 'Join Futr X',
    image: IMAGES.cutoutFounder,
    side: 'left',
  },
]

export default function Grow() {
  useSeo({
    title: "Let's Grow Together | Futr Markets",
    description:
      'Growth is not one-sided. Structured scale for manufacturers, and new market opportunity for young entrepreneurs through Futr X.',
    path: '/grow',
  })

  return (
    <>
      <PageHero
        eyebrow="Let's Grow"
        lines={["Let's Grow", { text: 'Together', accent: true }]}
        body="Because in a smarter market, growth is never one-sided."
      />

      {/* Framework lead (page 13). */}
      <Section tone="void" pad="md">
        <Container>
          <RevealOnScroll>
            <p className="max-w-[62ch] t-body text-white/70">
              Futr Markets builds structured pathways for growth, connecting
              manufacturing strength with entrepreneurial drive. Whether you
              create products or move them, we ensure your growth is backed by
              systems built for scale, consistency and opportunity.
            </p>
          </RevealOnScroll>
        </Container>
      </Section>

      <Section tone="void" pad="none" className="overflow-hidden grain">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-40 mask-fade" />
        </div>

        <Container className="relative">
          {BRANCHES.map((branch, i) => (
            <div
              key={branch.key}
              className={`grid items-center gap-8 border-white/10 py-16 md:py-24 lg:grid-cols-12 ${
                i > 0 ? 'border-t' : ''
              }`}
            >
              {/* Bleed past the container gutter so the figure meets the
                  viewport edge — a cut-out that stops at a margin still reads
                  as a photo in a box. */}
              <div
                className={`lg:col-span-5 ${
                  branch.side === 'left'
                    ? 'lg:order-2 lg:col-start-8 lg:-mr-[var(--fm-pad)]'
                    : 'lg:-ml-[var(--fm-pad)]'
                }`}
              >
                <CutoutFigure
                  src={branch.image.src}
                  alt={branch.image.alt}
                  side={branch.side}
                  ratio="4/5"
                  className="mx-auto w-full max-w-[24rem] lg:mx-0 lg:max-w-none"
                />
              </div>

              <div className={`lg:col-span-6 ${branch.side === 'left' ? 'lg:order-1' : 'lg:col-start-7'}`}>
                <RevealOnScroll>
                  <p className="t-eyebrow text-red">{branch.eyebrow}</p>
                </RevealOnScroll>
                <RevealOnScroll delay={90}>
                  <h2 className="mt-5 t-display">
                    {branch.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                </RevealOnScroll>
                <RevealOnScroll delay={160}>
                  <p className="mt-5 max-w-[46ch] t-body text-white/70">{branch.body}</p>
                </RevealOnScroll>
                <RevealOnScroll delay={230}>
                  <PrimaryCTA to={branch.to} size="lg" className="mt-8">
                    {branch.cta}
                  </PrimaryCTA>
                </RevealOnScroll>
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <Section tone="bone" pad="md">
        <Container className="text-center">
          <RevealOnScroll>
            <p className="t-body text-ash">
              Not sure which side you're on?{' '}
              <Link to="/talk" className="font-semibold text-ink underline decoration-red decoration-2 underline-offset-4">
                Talk to us
              </Link>{' '}
              and we'll work it out together.
            </p>
          </RevealOnScroll>
        </Container>
      </Section>
    </>
  )
}
