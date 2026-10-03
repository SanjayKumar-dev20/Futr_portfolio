/**
 * Shared motion primitives for staged entrances.
 *
 * The hero, the page hero and the split panels each hand-wrote the same four
 * lines — a transition string, an easing variable, a delay and an in/out
 * transform — with slightly different durations and offsets, so three things
 * that were meant to feel identical did not. These are the house values.
 *
 * Returns plain style objects rather than classes because the delay is
 * per-instance; Tailwind cannot express `transitionDelay: 437ms` without an
 * arbitrary value per call site, which is the duplication we are removing.
 */

const EASE_EXPO = 'var(--ease-out-expo)'
const EASE_QUINT = 'var(--ease-out-quint)'

/**
 * Fade-and-rise for a single element in a staged sequence.
 *
 * @param {boolean} active  has the section entered the viewport
 * @param {number}  delay   ms
 */
export function riseIn(active, delay = 0, { distance = 16, duration = 700 } = {}) {
  return {
    transition: `opacity ${duration}ms ${EASE_EXPO}, transform ${duration}ms ${EASE_EXPO}`,
    transitionDelay: `${delay}ms`,
    opacity: active ? 1 : 0,
    transform: active ? 'none' : `translateY(${distance}px)`,
  }
}

/** Opacity only — for backdrops and layers where movement would read as jitter. */
export function fadeIn(active, delay = 0, { duration = 1400 } = {}) {
  return {
    transition: `opacity ${duration}ms ${EASE_QUINT}`,
    transitionDelay: `${delay}ms`,
    opacity: active ? 1 : 0,
  }
}

/**
 * Builds an evenly-spaced sequence of delays.
 *
 * `const at = stagger(120, 110)` → at(0) === 120, at(1) === 230, …
 * Index-based rather than hand-written numbers so inserting a step cannot
 * leave the rest of the sequence stale.
 */
export const stagger =
  (start = 0, step = 90) =>
  (index) =>
    start + index * step
