import PageHero from '../../components/sections/PageHero'
import SectionIntro from '../../components/sections/SectionIntro'
import {
  AdvantageGrid,
  OutcomeList,
  ProblemSolution,
  ProcessSteps,
} from '../../components/sections/blocks'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { PrimaryCTA, SecondaryCTA } from '../../components/buttons'
import ImageFrame from '../../components/media/ImageFrame'
import MANUFACTURERS from '../../data/content/manufacturers'
import IMAGES from '../../data/images'
import { useSeo } from '../../lib/seo'

/**
 * Manufacturers — Creative Framework pages 19–21.
 *
 * The framework is explicit that this should read as "a growth manual, not a
 * pitch", so the page is structured as an argument: the gap, the reasons, the
 * method, the return, the commitment, the objections, the next step.
 */
export default function Manufacturers() {
  useSeo(MANUFACTURERS.seo)

  const { hero, whyPartner, howWeWork, whatYouGain, commitment, realities, nextStep } =
    MANUFACTURERS

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} lines={hero.lines} body={hero.body}>
        <PrimaryCTA to="/talk" size="lg">
          Partner with Futr
        </PrimaryCTA>
        <SecondaryCTA to="/invest" size="lg">
          Invest Futr
        </SecondaryCTA>
      </PageHero>

      {/* ── Lead ─────────────────────────────────────────────────────── */}
      <Section tone="light" pad="md">
        <Container>
          <RevealOnScroll>
            <p className="max-w-[62ch] t-body text-ash">{hero.lead}</p>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* ── Why partner ──────────────────────────────────────────────── */}
      <Section tone="bone" pad="lg" aria-labelledby="why-partner">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-5"
              eyebrow={whyPartner.eyebrow}
              heading={whyPartner.heading}
              headingId="why-partner"
              headingSize="h2"
              headingClassName="max-w-[14ch]"
              body={whyPartner.body}
              bodyClassName="max-w-[44ch]"
            />
            <div className="lg:col-span-6 lg:col-start-7">
              <ImageFrame
                src={IMAGES.manufacturingFloor.src}
                alt={IMAGES.manufacturingFloor.alt}
                ratio="16/10"
                rule
                className="mb-10"
              />
              <AdvantageGrid items={whyPartner.items} columns={3} className="!bg-rule" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── How we work ──────────────────────────────────────────────── */}
      <Section tone="void" pad="lg" className="overflow-hidden grain" aria-labelledby="how-we-work">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-25 mask-fade" />
        </div>
        <Container className="relative">
          <SectionIntro
            className="max-w-[48rem]"
            eyebrow={howWeWork.eyebrow}
            heading={howWeWork.heading}
            headingId="how-we-work"
            headingClassName="max-w-[18ch]"
            body={howWeWork.body}
            bodyClassName="max-w-[56ch]"
            tone="dark"
          />
          <ProcessSteps steps={howWeWork.steps} tone="dark" className="mt-16" />
        </Container>
      </Section>

      {/* ── What you gain ────────────────────────────────────────────── */}
      <Section tone="light" pad="lg" aria-labelledby="what-you-gain">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-6"
              eyebrow={whatYouGain.eyebrow}
              heading={whatYouGain.heading}
              headingId="what-you-gain"
              headingClassName="max-w-[16ch]"
              body={whatYouGain.body}
              bodyClassName="max-w-[50ch]"
            >
              <PrimaryCTA to="/talk" size="lg">
                Partner with Futr
              </PrimaryCTA>
            </SectionIntro>

            <div className="lg:col-span-5 lg:col-start-8 lg:pt-20">
              <OutcomeList items={whatYouGain.outcomes} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Our commitment ───────────────────────────────────────────── */}
      <Section tone="bone" pad="md" aria-labelledby="commitment">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <SectionIntro
              className="lg:col-span-5"
              eyebrow={commitment.eyebrow}
              heading={commitment.heading}
              headingId="commitment"
              headingSize="h2"
              headingClassName="max-w-[12ch]"
            />
            <RevealOnScroll delay={140} className="lg:col-span-6 lg:col-start-7 lg:self-end">
              <p className="max-w-[56ch] t-body text-ash">{commitment.body}</p>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      {/* ── Realities we solve ───────────────────────────────────────── */}
      <Section tone="light" pad="lg" aria-labelledby="realities">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-4"
              eyebrow={realities.eyebrow}
              heading={realities.heading}
              headingId="realities"
              headingSize="h2"
              headingClassName="max-w-[12ch]"
            />
            <ProblemSolution
              pairs={realities.pairs}
              className="lg:col-span-7 lg:col-start-6"
            />
          </div>
        </Container>
      </Section>

      {/* ── Next step ────────────────────────────────────────────────── */}
      <Section tone="void" pad="lg" className="overflow-hidden grain">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-25 mask-fade" />
          <div className="glow-red absolute left-1/4 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 opacity-35" />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-[48rem] text-center">
            <SectionIntro
              align="center"
              eyebrow={nextStep.eyebrow}
              heading={nextStep.heading}
              body={nextStep.body}
              bodyClassName="mx-auto max-w-[54ch]"
              tone="dark"
            >
              <PrimaryCTA to="/talk" size="lg">
                Partner with Futr
              </PrimaryCTA>
            </SectionIntro>
          </div>
        </Container>
      </Section>
    </>
  )
}
