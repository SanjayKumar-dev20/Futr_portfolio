/**
 * Image treatments, as data.
 *
 * ImageFrame used to decide its appearance from a pile of booleans — `duotone`,
 * `zoom`, `rule`, `scrim`, plus `treatment` — which meant every new look was a
 * new flag and a new branch inside the component, and illegal combinations
 * (a cut-out that is also duotone) were expressible but undefined.
 *
 * A treatment is now a named entry here. Adding one is adding an object; the
 * component never changes. Open for extension, closed for modification.
 */

/**
 * Where the cut-out's elliptical mask is centred.
 *
 * `side` names the edge that DISSOLVES — the one the copy sits on — so the
 * focal point moves away from it and the subject stays solid. This was
 * previously inlined in two places that had to agree; they are one function now.
 */
export const cutFocalX = (side) => (side === 'right' ? '42%' : '58%')

export const TREATMENTS = {
  /** A plain crop. Greyscale at rest, colour on hover, gentle zoom. */
  editorial: {
    classes: ['duo', 'zoom'],
    usesCutout: false,
  },

  /** Subject held, surroundings dissolved into graphite. No zoom — the mask
   *  edges would slide against a static vignette and shimmer. */
  cutout: {
    classes: ['img-cutout'],
    usesCutout: true,
  },

  /** Full-colour, no hover motion. For diagrams and product plates. */
  plate: {
    classes: [],
    usesCutout: false,
  },
}

export const getTreatment = (name) => TREATMENTS[name] ?? TREATMENTS.editorial
