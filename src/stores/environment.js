import { create } from 'zustand'

/**
 * Device and user-preference environment.
 *
 * Why this is a store and not just a hook:
 *
 * The previous `useMediaQuery` created a fresh `window.matchMedia` object and
 * a `change` listener per *call site*. `useReducedMotion` alone is consulted by
 * the providers, the page transition, the hero video, both scene components and
 * several sections — so a single home page was carrying a double-digit number
 * of listeners all watching the same four queries and all computing the same
 * answer.
 *
 * Here each query is subscribed to exactly once, for the lifetime of the app,
 * and every component reads the same value. The component-facing API in
 * `src/hooks` is unchanged, so nothing downstream knows or cares — which is the
 * point: call sites depend on `useReducedMotion()`, not on where the answer
 * comes from.
 */

/** The complete set of queries the design system reacts to. */
export const QUERIES = {
  reducedMotion: '(prefers-reduced-motion: reduce)',
  touch: '(hover: none), (pointer: coarse)',
  mobile: '(max-width: 767px)',
  tablet: '(max-width: 1024px)',
  // Bandwidth decision, not a layout one — see HeroVideo.
  smallScreenMedia: '(max-width: 820px)',
}

const canMatch = typeof window !== 'undefined' && typeof window.matchMedia === 'function'

const read = (query) => (canMatch ? window.matchMedia(query).matches : false)

const initial = Object.fromEntries(
  Object.entries(QUERIES).map(([key, query]) => [key, read(query)])
)

export const useEnvironmentStore = create(() => ({ ...initial }))

/**
 * Starts the single set of subscriptions. Called once from Providers.
 * Returns a teardown so React's StrictMode double-mount doesn't leak.
 */
export function subscribeToEnvironment() {
  if (!canMatch) return () => {}

  const teardowns = Object.entries(QUERIES).map(([key, query]) => {
    const mql = window.matchMedia(query)
    const onChange = (e) => useEnvironmentStore.setState({ [key]: e.matches })

    // Re-read on subscribe: the value can have changed between module
    // evaluation and mount (a resize during hydration, a devtools override).
    useEnvironmentStore.setState({ [key]: mql.matches })
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  })

  return () => teardowns.forEach((off) => off())
}

/* ── Selectors ────────────────────────────────────────────────────────────
   Exported individually so components subscribe to one boolean rather than
   the whole object — a change to `tablet` must not re-render everything that
   only cares about `reducedMotion`. */
export const selectReducedMotion = (s) => s.reducedMotion
export const selectTouch = (s) => s.touch
export const selectMobile = (s) => s.mobile
export const selectTablet = (s) => s.tablet
export const selectSmallScreenMedia = (s) => s.smallScreenMedia
