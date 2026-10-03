import { Container, RevealOnScroll, SectionHeading } from '../../../components/system'
import { PrimaryCTA, SecondaryCTA } from '../../../components/buttons'
import { CutoutFigure } from '../../../components/media/ImageFrame'
import HOME from '../../../data/content/home'
import IMAGES from '../../../data/images'

/**
 * Home section 07 — "Be Part of What's Next" (Creative Framework, page 14).
 *
 * This is the section the client's note was aimed at:
 *
 *   "Some cut out of human like the one I had would be nice — dark background.
 *    This doesn't bring focus into the core emotion."
 *
 * So the figure is cut out of his surroundings and set against graphite with
 * the grid and a red glow behind him, instead of a wide skyline photograph with
 * a small person in it. The emotion sits on the person, and the copy sits at
 * the same optical weight beside him rather than floating over the image.
 */
export default function BuildFuture() {
  const { next } = HOME

  return (
    <section
      aria-labelledby="build-heading"
      className="relative isolate overflow-hidden surface-void on-dark grain"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid mask-fade opacity-50" />
        <div className="glow-red absolute -left-20 bottom-0 h-[32rem] w-[32rem] opacity-45" />
      </div>

      <Container className="relative">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Cut-out figure. Pulled out past the container gutter on desktop
              so the subject bleeds off the left edge the way the comp does —
              a figure boxed inside the grid reads as a photo in a slot, which
              is exactly the flatness the client objected to. */}
          <div className="relative lg:col-span-4 lg:-ml-[var(--fm-pad)]">
            <CutoutFigure
              src={IMAGES.cutoutOwner.src}
              alt={IMAGES.cutoutOwner.alt}
              side="right"
              ratio="3/4"
              className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-none"
            />
          </div>

          {/* Copy */}
          <div className="pb-16 pt-4 lg:col-span-5 lg:py-28">
            <RevealOnScroll>
              <p className="t-eyebrow text-red">{next.eyebrow}</p>
            </RevealOnScroll>

            <RevealOnScroll delay={90}>
              <SectionHeading
                id="build-heading"
                size="display"
                accent="What's Next"
                className="mt-5 max-w-[14ch]"
              >
                {next.heading}
              </SectionHeading>
            </RevealOnScroll>

            <RevealOnScroll delay={170}>
              <p className="mt-6 max-w-[36ch] t-body text-white/70">{next.subheading}</p>
            </RevealOnScroll>
          </div>

          {/* Supporting list + CTA */}
          <div className="pb-16 lg:col-span-3 lg:py-28">
            <RevealOnScroll delay={160}>
              <p className="max-w-[34ch] t-small text-white/55">{next.body}</p>
            </RevealOnScroll>

            <RevealOnScroll delay={220}>
              <ul className="mt-7 space-y-2.5 t-small text-white/70">
                {next.points.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-red" />
                    {line}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryCTA to="/talk" size="lg">
                  Talk to Us
                </PrimaryCTA>
                <SecondaryCTA to="/invest" size="lg" tone="dark">
                  Invest Futr
                </SecondaryCTA>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </section>
  )
}
