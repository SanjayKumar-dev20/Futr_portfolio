import { create } from 'zustand'

/**
 * Scroll position, published once.
 *
 * Same argument as the environment store: `useScrolled` and `useScrollProgress`
 * each attached their own `scroll` listener and ran their own rAF loop, and the
 * navbar plus any progress indicator meant several of them competing to compute
 * the same two numbers on every frame.
 *
 * One listener writes here; components select the single field they care about.
 * Lenis, when it is running, drives this directly from its own loop instead of
 * adding a second source of truth.
 */
export const useScrollStore = create(() => ({
  y: 0,
  /** 0 → 1 through the document. */
  progress: 0,
  /** Past the threshold the navbar uses to adopt a surface. */
  scrolled: false,
}))

/** The point at which the navbar stops being transparent. */
const NAV_THRESHOLD = 32

export function publishScroll(y) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const next = {
    y,
    progress: max > 0 ? Math.min(1, Math.max(0, y / max)) : 0,
    scrolled: y > NAV_THRESHOLD,
  }

  const prev = useScrollStore.getState()
  // `y` changes every frame but `scrolled` almost never does. Only write when
  // something a subscriber selects has actually moved, so the navbar is not
  // re-rendered 60 times a second to be told it is still scrolled.
  if (
    prev.y !== next.y ||
    prev.scrolled !== next.scrolled ||
    Math.abs(prev.progress - next.progress) > 0.001
  ) {
    useScrollStore.setState(next)
  }
}

/**
 * Native scroll listener. Used when Lenis is not running (touch devices and
 * reduced-motion), where it is the only source. Providers owns the lifecycle.
 */
export function subscribeToNativeScroll() {
  if (typeof window === 'undefined') return () => {}

  let frame = 0
  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      publishScroll(window.scrollY)
      frame = 0
    })
  }

  publishScroll(window.scrollY)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (frame) cancelAnimationFrame(frame)
  }
}

export const selectScrolled = (s) => s.scrolled
export const selectProgress = (s) => s.progress
export const selectScrollY = (s) => s.y
