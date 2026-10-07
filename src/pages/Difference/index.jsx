import PageHero from '../../components/sections/PageHero'
import SectionIntro from '../../components/sections/SectionIntro'
import {
  AdvantageGrid,
  PrincipleList,
  StatementBand,
} from '../../components/sections/blocks'
import { Container, RevealOnScroll, Section } from '../../components/system'
import { PrimaryCTA, SecondaryCTA } from '../../components/buttons'
import { IconCube, IconFactory, IconStore, IconTruck, IconUsers, IconChart } from '../../components/icons'
import DIFFERENCE from '../../data/content/difference'
import SystemDiagram from '../../components/graphics/SystemDiagram'
import DirectFlow from '../../components/graphics/DirectFlow'
import { useSeo } from '../../lib/seo'

/**
 * The Futr Difference — built from Creative Framework pages 15–18.
 *
 * Framework design direction for this page, followed literally:
 *   "Wide white sections with short, strong copy blocks — rhythm, not bulk."
 *   "Flow lines, network grids or connection visuals instead of product shots."
 *
 * So this is the one page in the site with no photography at all.
 */
export default function Difference() {
  useSeo(DIFFERENCE.seo)

  const { hero, realEconomy, principles, systemView, advantage, outcome, whyItMatters } = DIFFERENCE

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} lines={hero.lines} body={hero.body}>
        <PrimaryCTA to="/manufacturers" size="lg">
          Partner with Futr
        </PrimaryCTA>
        <SecondaryCTA to="/invest" size="lg">
          Invest Futr
        </SecondaryCTA>
      </PageHero>

      {/* ── Lead statement ─────────────────────────────────────────────
          The lead paragraph and the isometric city sat alone in this band and
          left most of it white, which is the review note on this page. The flow
          strip below them states the page's argument as a diagram — the chain
          being removed, and the route that replaces it — so the white space is
          carrying the idea rather than waiting for a photograph the framework
          says this page should not have. */}
      <Section tone="light" pad="md">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <RevealOnScroll className="lg:col-span-5">
              <p className="max-w-[60ch] t-body text-ash">{hero.lead}</p>
            </RevealOnScroll>
            <div className="lg:col-span-7">
              <SystemDiagram className="mx-auto max-w-[48rem]" />
              <p className="mt-2 text-center t-eyebrow text-ash">Manufacturing <span className="mx-2 text-red">/</span> Supply <span className="mx-2 text-red">/</span> Market</p>
            </div>
          </div>

          <DirectFlow className="mt-16 border-t border-rule pt-12 md:mt-20 md:pt-14" />
        </Container>
      </Section>

      {/* ── The real economy ─────────────────────────────────────────── */}
      <Section tone="bone" pad="lg" aria-labelledby="real-economy">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-5"
              eyebrow={realEconomy.eyebrow}
              heading={realEconomy.heading}
              headingId="real-economy"
              headingClassName="max-w-[16ch]"
              body={realEconomy.body}
              bodyClassName="max-w-[40ch]"
            />

            <div className="lg:col-span-6 lg:col-start-7">
              {/* `--fm-tile-min` is 11rem because "Manufacturers" is 126px at
                  this weight and the tile carries 24px of padding each side.
                  Three tracks inside this half-width column were 160px at
                  tablet widths, which clipped the word. */}
              <ul
                className="fm-tiles bg-rule"
                style={{ '--fm-tile-min': '11rem', '--fm-tile-cols': 3 }}
              >
                {realEconomy.contributors.map((c, i) => {
                  const Icon = [IconFactory, IconStore, IconUsers][i]
                  return (
                    <RevealOnScroll
                      as="li"
                      key={c.label}
                      delay={i * 100}
                      className="surface-bone p-6"
                    >
                      <span className="block text-red">
                        <Icon size={26} />
                      </span>
                      <p className="mt-5 t-eyebrow text-ash">{c.role}</p>
                      <p className="mt-2 text-[1.0625rem] font-bold tracking-[-0.02em]">
                        {c.label}
                      </p>
                    </RevealOnScroll>
                  )
                })}
              </ul>

              <RevealOnScroll delay={320}>
                <p className="mt-8 border-l-2 border-red pl-5 max-w-[52ch] t-small text-ash">
                  {realEconomy.note}
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={400}>
                <p className="mt-6 max-w-[52ch] t-body">{realEconomy.close}</p>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── How Futr thinks differently ──────────────────────────────── */}
      <Section tone="light" pad="lg" aria-labelledby="principles">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
              eyebrow={principles.eyebrow}
              heading={principles.heading}
              headingId="principles"
              headingClassName="max-w-[14ch]"
              body={principles.body}
              bodyClassName="max-w-[42ch]"
            />
            <PrincipleList
              items={principles.items}
              className="lg:col-span-6 lg:col-start-7"
            />
          </div>
        </Container>
      </Section>

      {/* ── The system view ──────────────────────────────────────────── */}
      <Section tone="void" pad="lg" className="overflow-hidden grain" aria-labelledby="system-view">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-30 mask-fade" />
          <div className="glow-red absolute right-[8%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 opacity-35" />
        </div>

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <SectionIntro
              className="lg:col-span-5"
              eyebrow={systemView.eyebrow}
              heading={systemView.heading}
              headingId="system-view"
              headingClassName="max-w-[14ch]"
              body={systemView.body}
              bodyClassName="max-w-[42ch]"
              tone="dark"
            />

            <ul className="grid gap-px bg-white/10 lg:col-span-6 lg:col-start-7">
              {systemView.layers.map((layer, i) => {
                const Icon = [IconCube, IconTruck, IconChart][i]
                return (
                  <RevealOnScroll
                    as="li"
                    key={layer.title}
                    delay={i * 110}
                    className="surface-void p-7 md:p-8"
                  >
                    <div className="flex items-start gap-5">
                      <span className="mt-1 shrink-0 text-red">
                        <Icon size={26} />
                      </span>
                      <div>
                        <h3 className="t-h3">{layer.title}</h3>
                        <p className="mt-2 max-w-[46ch] t-small text-white/60">{layer.body}</p>
                      </div>
                    </div>
                  </RevealOnScroll>
                )
              })}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── The Futr advantage ───────────────────────────────────────── */}
      <Section tone="bone" pad="lg" aria-labelledby="advantage">
        <Container>
          <SectionIntro
            className="max-w-[52rem]"
            eyebrow={advantage.eyebrow}
            heading={advantage.heading}
            headingId="advantage"
            headingClassName="max-w-[18ch]"
            body={advantage.body}
            bodyClassName="max-w-[58ch]"
          />
        </Container>
        <Container className="mt-14">
          <AdvantageGrid items={advantage.items} columns={4} />
        </Container>
      </Section>

      {/* ── The outcome ──────────────────────────────────────────────── */}
      <Section tone="light" pad="lg" aria-labelledby="outcome">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <SectionIntro
              className="lg:col-span-7"
              eyebrow={outcome.eyebrow}
              heading={outcome.heading}
              headingId="outcome"
              headingClassName="max-w-[14ch]"
            />
            <RevealOnScroll delay={160} className="lg:col-span-5 lg:self-end">
              <p className="max-w-[48ch] t-body text-ash">{outcome.body}</p>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>

      {/* ── Why it matters ───────────────────────────────────────────── */}
      <StatementBand tone="void" eyebrow={whyItMatters.eyebrow}>
        {whyItMatters.heading}
      </StatementBand>

      <Section tone="void" pad="md" className="overflow-hidden">
        <Container>
          <div className="mx-auto max-w-[56rem] text-center">
            <RevealOnScroll>
              <p className="t-body text-white/70">{whyItMatters.body}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={110}>
              <p className="mt-6 t-h3">{whyItMatters.close}</p>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <PrimaryCTA to="/manufacturers" size="lg">
                  Partner with Futr
                </PrimaryCTA>
                <SecondaryCTA to="/invest" size="lg">
                  Invest Futr
                </SecondaryCTA>
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </Section>
    </>
  )
}
