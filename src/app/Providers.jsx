import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { useIsTouch, useReducedMotion } from '../hooks'
import { subscribeToEnvironment } from '../stores/environment'
import { publishScroll, subscribeToNativeScroll } from '../stores/scroll'
import { ScrollTrigger } from '../animations'

/**
 * Owns every app-wide subscription.
 *
 * Single responsibility, read as "lifecycle": each effect starts one source of
 * truth and tears it down. Nothing here renders, and nothing else in the app
 * attaches a `matchMedia` or `scroll` listener — components read the resulting
 * stores instead.
 */
export default function Providers({ children }) {
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()
  const { pathname } = useLocation()
  const lenisRef = useRef(null)

  /* ── Media queries: one subscription per query, app-wide ─────────────── */
  useEffect(() => subscribeToEnvironment(), [])

  /* ── Smooth scroll ───────────────────────────────────────────────────────
     Skipped entirely on touch (native momentum beats anything simulated) and
     under reduced motion. When Lenis is off, a plain listener feeds the same
     store so consumers never need to know which is running. */
  const smooth = !prefersReduced && !isTouch

  useEffect(() => {
    if (!smooth) return subscribeToNativeScroll()

    /*
      `lerp`, not `duration`. A duration-based config restarts a ~1s eased
      animation on every wheel event, so the viewport permanently trails the
      input and the site reads as sluggish even at a locked 60fps. A lerp
      follows the pointer continuously; 0.14 keeps the weighted feel the brief
      asks for while staying inside the ~100ms input-latency budget.
    */
    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      syncTouch: false,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ({ scroll }) => {
      publishScroll(scroll)
      ScrollTrigger.update()
    })

    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [smooth])

  /* ── Reset scroll on navigation ──────────────────────────────────────── */
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    publishScroll(0)
    // Triggers measured against the previous page's height are now wrong.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return children
}
