import { Eyebrow, RevealOnScroll, SectionHeading } from '../system'

/**
 * Eyebrow → heading → body → actions.
 *
 * This exact lockup, with the same stagger, appeared in The Futr Impact,
 * A Complete System, The Opportunity, Invest Futr and the Let's Grow panels —
 * each one hand-rolling three or four `<RevealOnScroll delay={n}>` wrappers and
 * each one picking slightly different delays, so the sections drifted out of
 * rhythm with each other.
 *
 * The stagger is now defined once. A section passes content and gets the house
 * cadence; `step` is there for the rare block that needs a different pace.
 */
export default function SectionIntro({
  eyebrow,
  eyebrowTone = 'red',
  heading,
  /** Explicit line breaks, when the break point is design rather than measure. */
  headingLines,
  headingId,
  headingSize = 'display',
  accent,
  body,
  children,
  tone = 'light', // light | dark — picks the body colour
  align = 'left',
  className = '',
  headingClassName = '',
  bodyClassName = '',
  startDelay = 0,
  step = 90,
}) {
  // One counter, so inserting or removing a part cannot desynchronise the rest.
  let index = 0
  const nextDelay = () => startDelay + index++ * step

  const bodyColour = tone === 'dark' ? 'text-white/70' : 'text-ash'

  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <RevealOnScroll delay={nextDelay()}>
          <Eyebrow tone={eyebrowTone} className={align === 'center' ? 'justify-center' : ''}>
            {eyebrow}
          </Eyebrow>
        </RevealOnScroll>
      )}

      {/*
        `mt-4` under the eyebrow, `mt-6` over the body.

        Not an oversight that these differ. The eyebrow is a label *for* the
        heading and belongs to it, so the gap there is tight; the body is a
        separate thought and gets room. Setting both to the same value — which
        is what this did — flattens the block into three evenly-spaced lines
        with no hierarchy, which is exactly the Canva note on the feature cards.
      */}
      {(heading || headingLines) && (
        <RevealOnScroll delay={nextDelay()}>
          <SectionHeading
            id={headingId}
            size={headingSize}
            accent={accent}
            lines={headingLines}
            className={`mt-4 ${headingClassName}`}
          >
            {heading}
          </SectionHeading>
        </RevealOnScroll>
      )}

      {body && (
        <RevealOnScroll delay={nextDelay()}>
          <p className={`mt-6 t-body ${bodyColour} ${bodyClassName}`}>{body}</p>
        </RevealOnScroll>
      )}

      {children && (
        <RevealOnScroll delay={nextDelay()}>
          <div
            className={`mt-9 flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : ''}`}
          >
            {children}
          </div>
        </RevealOnScroll>
      )}
    </div>
  )
}
