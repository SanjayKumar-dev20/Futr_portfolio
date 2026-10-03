import PageHero from '../../components/sections/PageHero'
import SectionIntro from '../../components/sections/SectionIntro'
import {
  OutcomeList,
  PrincipleList,
  ProcessSteps,
  StatementBand,
} from '../../components/sections/blocks'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { PrimaryCTA, SecondaryCTA } from '../../components/buttons'
import { CutoutFigure } from '../../components/media/ImageFrame'
import FUTR_X from '../../data/content/futrx'
import IMAGES from '../../data/images'
import { useSeo } from '../../lib/seo'

/**
 * Futr X — Creative Framework pages 22–24.
 *
 * The framework's design notes for this page are the most specific in the
 * document: "dynamic grid lines / X motif graphics showing connection and
 * motion", "black-white base, red accents for energy", and imagery of "real
 * faces, urban settings, hands-on work, action shots (not generic startup
 * poses)". The X motif below is SVG and GSAP-free by design — the plan is
 * explicit that this page should not carry a second 3D scene.
 */
export default function FutrX() {
  useSeo(FUTR_X.seo)

  const { hero, whyFutrX, howItWorks, whatYouGain, movement } = FUTR_X

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} lines={hero.lines} body={hero.body}>
        <PrimaryCTA to="/talk" size="lg">
          Join Futr X
        </PrimaryCTA>
        <SecondaryCTA to="/talk" size="lg">
          Talk to Us
        </SecondaryCTA>
      </PageHero>

      {/* ── Lead + X motif ───────────────────────────────────────────── */}
      <Section tone="void" pad="md" className="overflow-hidden">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <RevealOnScroll className="lg:col-span-7">
              <p className="max-w-[56ch] t-body text-white/70">{hero.lead}</p>
            </RevealOnScroll>
            <div className="lg:col-span-4 lg:col-start-9">
              <XMotif />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Why Futr X ───────────────────────────────────────────────── */}
      <Section tone="bone" pad="lg" aria-labelledby="why-futr-x">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
              eyebrow={whyFutrX.eyebrow}
              heading={whyFutrX.heading}
              headingId="why-futr-x"
              headingClassName="max-w-[12ch]"
              body={whyFutrX.body}
              bodyClassName="max-w-[44ch]"
            />
            <PrincipleList items={whyFutrX.pillars} className="lg:col-span-6 lg:col-start-7" />
          </div>
        </Container>
      </Section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <Section tone="light" pad="lg" aria-labelledby="how-it-works">
        <Container>
          <SectionIntro
            className="max-w-[48rem]"
            eyebrow={howItWorks.eyebrow}
            heading={howItWorks.heading}
            headingId="how-it-works"
            headingClassName="max-w-[16ch]"
            body={howItWorks.body}
            bodyClassName="max-w-[56ch]"
          />
          <ProcessSteps steps={howItWorks.stages} className="mt-16" />
        </Container>
      </Section>

      {/* ── What you gain ────────────────────────────────────────────── */}
      <Section tone="void" pad="lg" className="overflow-hidden grain" aria-labelledby="gain">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-25 mask-fade" />
        </div>
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4 lg:-ml-[var(--fm-pad)]">
              <CutoutFigure
                src={IMAGES.cutoutFounder.src}
                alt={IMAGES.cutoutFounder.alt}
                side="right"
                ratio="4/5"
                className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-none"
              />
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <SectionIntro
                eyebrow={whatYouGain.eyebrow}
                heading={whatYouGain.heading}
                headingId="gain"
                headingSize="h2"
                headingClassName="max-w-[18ch]"
                body={whatYouGain.body}
                bodyClassName="max-w-[50ch]"
                tone="dark"
              />
              <OutcomeList items={whatYouGain.benefits} tone="dark" className="mt-9" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── The movement ─────────────────────────────────────────────── */}
      <Section tone="light" pad="lg" aria-labelledby="movement">
        <Container>
          <div className="mx-auto max-w-[52rem] text-center">
            <SectionIntro
              align="center"
              eyebrow={movement.eyebrow}
              heading={movement.heading}
              headingId="movement"
              headingClassName="mx-auto max-w-[16ch]"
              body={movement.body}
              bodyClassName="mx-auto max-w-[52ch]"
            />
            <RevealOnScroll delay={280}>
              <p className="mt-6 t-h3">{movement.close}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={360}>
              <div className="mt-10 flex justify-center">
                <PrimaryCTA to="/talk" size="lg">
                  Join Futr X
                </PrimaryCTA>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      <StatementBand tone="void">{movement.statement}</StatementBand>
    </>
  )
}

/**
 * The X motif the framework calls for: two crossing axes with nodes along them,
 * drawn as SVG so it stays sharp and costs nothing. The strokes draw themselves
 * once on entry rather than looping — the brief warns against decoration.
 */
function XMotif() {
  return (
    <RevealOnScroll>
      <svg viewBox="0 0 200 200" className="w-full max-w-[18rem]" fill="none" aria-hidden>
        <defs>
          <linearGradient id="fx-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF0B2A" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FF0B2A" />
            <stop offset="100%" stopColor="#FF0B2A" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* grid */}
        {[40, 80, 120, 160].map((v) => (
          <g key={v} stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="0.6">
            <line x1={v} y1="10" x2={v} y2="190" />
            <line x1="10" y1={v} x2="190" y2={v} />
          </g>
        ))}

        {/* the X */}
        <line x1="30" y1="30" x2="170" y2="170" stroke="url(#fx-a)" strokeWidth="2" />
        <line x1="170" y1="30" x2="30" y2="170" stroke="url(#fx-a)" strokeWidth="2" />

        {/* nodes along both axes */}
        {[30, 65, 100, 135, 170].map((p, i) => (
          <g key={p}>
            <circle cx={p} cy={p} r={i === 2 ? 4 : 2.5} fill="#FF2F46" />
            <circle cx={200 - p} cy={p} r={i === 2 ? 0 : 2.5} fill="#FF2F46" opacity="0.7" />
          </g>
        ))}

        <circle cx="100" cy="100" r="12" stroke="#FF0B2A" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="100" cy="100" r="22" stroke="#FF0B2A" strokeOpacity="0.2" strokeWidth="1" />
      </svg>
    </RevealOnScroll>
  )
}
