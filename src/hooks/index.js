import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useEnvironmentStore,
  selectReducedMotion,
  selectTouch,
  selectMobile,
  selectTablet,
  selectSmallScreenMedia,
} from '../stores/environment'
import { useScrollStore, selectScrolled, selectProgress } from '../stores/scroll'

/* ===========================================================================
   ENVIRONMENT
   ---------------------------------------------------------------------------
   These read from a store that holds one subscription per media query for the
   whole app. The signatures are unchanged from the per-call-site matchMedia
   versions they replaced, which is the point — a component asks "should I
   animate?" and does not need to know that the answer is now shared. Swapping
   the implementation again later touches this file only.
   =========================================================================== */

export const useReducedMotion = () => useEnvironmentStore(selectReducedMotion)
export const useIsTouch = () => useEnvironmentStore(selectTouch)
export const useIsMobile = () => useEnvironmentStore(selectMobile)
export const useIsTablet = () => useEnvironmentStore(selectTablet)
export const useIsSmallScreenMedia = () => useEnvironmentStore(selectSmallScreenMedia)

/* ===========================================================================
   SCROLL
   =========================================================================== */

/** True once past the navbar threshold. One shared listener, not one per call. */
export const useScrolled = () => useScrollStore(selectScrolled)

/** 0 → 1 progress through the document. */
export const useScrollProgress = () => useScrollStore(selectProgress)

/* ===========================================================================
   LOCAL HOOKS
   ---------------------------------------------------------------------------
   Everything below is genuinely per-element state. It stays local: a store
   keyed by element would be a worse version of what React already does.
   =========================================================================== */

/**
 * Reports when the ref'd element first enters the viewport.
 * One observer per element, disconnected on reveal — cheap enough to use on
 * every block on a long page.
 *
 * Caveat worth knowing: never put `clip-path`, `scale(0)` or anything else
 * that collapses the box onto the element you are observing. The intersection
 * rect is computed after those apply, so the ratio stays 0 and the observer
 * never fires. Animate an inner wrapper instead.
 */
export function useInView({ threshold = 0.16, rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}

/**
 * Normalised pointer position (-1 → 1 on both axes), lerped.
 * Returns a ref rather than state on purpose: this updates every frame and
 * re-rendering at 60fps to move a background is exactly the cost it is meant
 * to avoid. Read `.current` inside your own rAF.
 */
export function usePointer({ damp = 0.08, enabled = true } = {}) {
  const target = useRef({ x: 0, y: 0 })
  const value = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf
    const tick = () => {
      value.current.x += (target.current.x - value.current.x) * damp
      value.current.y += (target.current.y - value.current.y) * damp
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [damp, enabled])

  return value
}

/** Locks body scroll (mobile menu). Restores the exact scroll position. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const y = window.scrollY
    const { body } = document
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      Object.assign(body.style, prev)
      window.scrollTo(0, y)
    }
  }, [locked])
}

/**
 * Keeps keyboard focus inside an open overlay, and puts it back when it closes.
 *
 * Hiding a full-screen panel with `clip-path` or `opacity` hides it from eyes
 * only. Its links stay in the tab order, so a keyboard user tabbing down the
 * page walks into a menu that is not on screen and cannot tell where they are
 * — and `pointer-events: none` does nothing about it, because that is a mouse
 * control. The panel must be `inert` while closed, which is the caller's job,
 * and focus must be managed while open, which is this.
 *
 * `extraRefs` exists for the common case where the control that opens the
 * overlay is also the control that closes it, and lives outside the panel.
 * Trapping focus strictly inside the panel would make that close button
 * unreachable by keyboard, which trades one trap for another.
 *
 * The trap is only a convenience: Escape still closes the menu, so nobody is
 * ever actually stuck.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active, { containerRef, extraRefs = [] } = {}) {
  // Read through a ref so adding or removing an extra element never restarts
  // the effect — restarting would steal focus back to the top mid-interaction.
  const extras = useRef(extraRefs)
  extras.current = extraRefs

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const restoreTo = document.activeElement

    // Recomputed on every Tab rather than captured once: the panel staggers
    // its items in, and a list captured at open time can be stale by the time
    // anyone presses a key.
    const focusables = () =>
      [
        ...extras.current.map((r) => r.current).filter(Boolean),
        ...container.querySelectorAll(FOCUSABLE),
      ].filter((el) => el.offsetParent !== null || el === document.activeElement)

    // Move focus into the panel so a screen reader starts reading the menu
    // rather than leaving the user wherever they were on the page behind it.
    container.querySelector(FOCUSABLE)?.focus()

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return

      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement

      if (!items.includes(current)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    // Capture phase, so this wins before anything inside the panel handles Tab.
    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      // Put the user back where they were. Without this, closing the menu
      // drops focus to <body> and the next Tab restarts from the top of the
      // document — losing a keyboard user's place entirely.
      if (restoreTo instanceof HTMLElement && document.contains(restoreTo)) {
        restoreTo.focus()
      }
    }
  }, [active, containerRef])
}

/** Stable callback ref that always sees the latest closure. */
export function useEvent(fn) {
  const ref = useRef(fn)
  useEffect(() => {
    ref.current = fn
  })
  return useCallback((...args) => ref.current?.(...args), [])
}
