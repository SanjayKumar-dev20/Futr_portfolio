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
        <SectionIntro
          className="max-w-[46rem]"
          eyebrow={grow.eyebrow}
          heading={grow.heading}
          headingId="grow-preview"
          headingClassName="max-w-[20ch]"
          body={grow.body}
          bodyClassName="max-w-[58ch]"
        />

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
