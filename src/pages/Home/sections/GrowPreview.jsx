import { Container, RevealOnScroll, Section } from '../../../components/system'
import SectionIntro from '../../../components/sections/SectionIntro'
import { TextLink } from '../../../components/buttons'
import ImageFrame from '../../../components/media/ImageFrame'
import HOME from '../../../data/content/home'
import IMAGES from '../../../data/images'

/**
 * Home section 05 — Let's Grow preview.
 *
 * Two branches, matching the framework's split: manufacturers and young
 * entrepreneurs. Editorial photography rather than cut-outs here — the cut-out
 * treatment is reserved for the closing CTA so it keeps its impact.
 */
const BRANCH_IMAGES = [IMAGES.manufacturingMachine, IMAGES.cutoutEntrepreneur]

export default function GrowPreview() {
  const { grow } = HOME

  return (
    <Section tone="bone" pad="lg" aria-labelledby="grow-preview">
      <Container>
        {/*
          Heading and supporting copy run side by side rather than stacked in a
          46rem column — stacked, the right 60% of the band was empty at desktop
          widths, which is the "excessive dead space" note.

          `accent` paints the closing clause red. It is the line the section
          turns on, and the brief's rule is red for the words that matter.
        */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionIntro
            className="lg:col-span-7"
            eyebrow={grow.eyebrow}
            heading={grow.heading}
            accent={grow.accent}
            headingId="grow-preview"
          />
          <RevealOnScroll delay={180} className="lg:col-span-5 lg:pb-1">
            <p className="max-w-[56ch] t-body text-ash">{grow.body}</p>
          </RevealOnScroll>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-6">
          {grow.branches.map((branch, i) => (
            <RevealOnScroll key={branch.key} delay={i * 120}>
              <article className="group flex h-full flex-col">
                <ImageFrame
                  src={BRANCH_IMAGES[i].src}
                  alt={BRANCH_IMAGES[i].alt}
                  ratio="16/10"
                  rule
                />
                <p className="mt-7 t-eyebrow text-red">{branch.eyebrow}</p>
                <h3 className="mt-4 t-h2 max-w-[16ch]">{branch.heading}</h3>
                <p className="mt-4 max-w-[46ch] t-small text-ash">{branch.body}</p>
                <div className="mt-auto pt-7">
                  <TextLink to={branch.cta.to}>{branch.cta.label}</TextLink>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </Section>
  )
}
