import PageHero from '../../components/sections/PageHero'
import SectionIntro from '../../components/sections/SectionIntro'
import {
  AdvantageGrid,
  PrincipleList,
  StatementBand,
} from '../../components/sections/blocks'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { PrimaryCTA, SecondaryCTA } from '../../components/buttons'
import INVEST from '../../data/content/invest'
import { useSeo } from '../../lib/seo'

/**
 * Invest Futr — Creative Framework pages 25–27.
 *
 * The framework's design direction is unusually prescriptive here and is
 * followed exactly: dark-grey dominant, red accent, network flows and grid
 * overlays, generous spacing, "institutional confidence — think financial
 * infrastructure, not startup energy."
 *
 * Consequently this is the only page that is dark end to end, and the only one
 * with no photography: the framework asks for abstract systems, not faces.
 */
export default function Invest() {
  useSeo(INVEST.seo)

  const { hero, why, model, whyInvest, impact, closing } = INVEST

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} lines={hero.lines} body={hero.body}>
        <PrimaryCTA to="/talk" size="lg">
          Invest Futr
        </PrimaryCTA>
        <SecondaryCTA to="/difference" size="lg">
          How the system works
        </SecondaryCTA>
      </PageHero>

      {/* ── Lead ─────────────────────────────────────────────────────── */}
      <Section tone="void" pad="md">
        <Container>
          <RevealOnScroll>
            <p className="max-w-[64ch] t-body text-white/70">{hero.lead}</p>
          </RevealOnScroll>
        </Container>
      </Section>

      {/* ── Why Futr Markets ─────────────────────────────────────────── */}
      <Section tone="dark" pad="lg" className="overflow-hidden grain" aria-labelledby="why">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-25 mask-fade" />
        </div>
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12">
            <SectionIntro
              className="lg:col-span-6"
              eyebrow={why.eyebrow}
              heading={why.heading}
              headingId="why"
              headingClassName="max-w-[16ch]"
              tone="dark"
            />
            <RevealOnScroll delay={160} className="lg:col-span-5 lg:col-start-8 lg:self-end">
              <p className="max-w-[52ch] t-body text-white/65">{why.body}</p>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      {/* ── The model ────────────────────────────────────────────────── */}
      <Section tone="void" pad="lg" aria-labelledby="model">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
              eyebrow={model.eyebrow}
              heading={model.heading}
              headingId="model"
              headingClassName="max-w-[14ch]"
              body={model.body}
              bodyClassName="max-w-[46ch]"
              tone="dark"
            />
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="t-eyebrow text-white/35">Three engines of growth</p>
              <PrincipleList items={model.engines} tone="dark" className="mt-8" />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Why invest ───────────────────────────────────────────────── */}
      <Section tone="dark" pad="lg" className="overflow-hidden" aria-labelledby="why-invest">
        <Container>
          <SectionIntro
            className="max-w-[52rem]"
            eyebrow={whyInvest.eyebrow}
            heading={whyInvest.heading}
            headingId="why-invest"
            headingClassName="max-w-[18ch]"
            body={whyInvest.body}
            bodyClassName="max-w-[58ch]"
            tone="dark"
          />
        </Container>
        <Container className="mt-14">
          <AdvantageGrid items={whyInvest.advantages} tone="dark" columns={4} />
        </Container>
      </Section>

      {/* ── The Futr impact ──────────────────────────────────────────── */}
      <Section tone="void" pad="lg" className="overflow-hidden grain" aria-labelledby="impact">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="glow-red absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 opacity-30" />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-[54rem] text-center">
            <SectionIntro
              align="center"
              eyebrow={impact.eyebrow}
              heading={impact.heading}
              headingId="impact"
              headingClassName="mx-auto max-w-[18ch]"
              body={impact.body}
              bodyClassName="mx-auto max-w-[58ch]"
              tone="dark"
            />
          </div>
        </Container>
      </Section>

      {/* ── Closing ──────────────────────────────────────────────────── */}
      <StatementBand tone="dark">{closing.heading}</StatementBand>

      <Section tone="dark" pad="md">
        <Container>
          <div className="mx-auto max-w-[54rem] text-center">
            <RevealOnScroll>
              <p className="t-body text-white/70">{closing.body}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={120}>
              <p className="mt-10 border-t border-white/10 pt-10 t-h3 text-white/85">
                {closing.statement}
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={220}>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <PrimaryCTA to="/talk" size="lg">
                  Invest Futr
                </PrimaryCTA>
                <SecondaryCTA to="/talk" size="lg">
                  Request the investor deck
                </SecondaryCTA>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
