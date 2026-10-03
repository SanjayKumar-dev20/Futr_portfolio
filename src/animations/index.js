/**
 * Centralised motion utilities.
 *
 * The CSS in animations.css handles the common case (scroll reveals) because
 * IntersectionObserver + a class is cheaper and smoother than a ScrollTrigger
 * per block. GSAP is reserved for the things CSS genuinely cannot do:
 * scrubbed progress lines, pinned sequences, and the staged hero timeline.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  inOut: 'power2.inOut',
}

/** Default reveal from the brief: y 40 → 0, opacity 0 → 1, ~0.7s ease-out. */
export function fadeUp(targets, { delay = 0, y = 40, stagger = 0.08, duration = 0.7 } = {}) {
  if (reduced()) return gsap.set(targets, { opacity: 1, y: 0 })
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, stagger, ease: EASE.out }
  )
}

export function fadeIn(targets, { delay = 0, duration = 0.6, stagger = 0.06 } = {}) {
  if (reduced()) return gsap.set(targets, { opacity: 1 })
  return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration, delay, stagger, ease: EASE.out })
}

/** Line-by-line type reveal — hero only. Expects pre-wrapped .line-mask spans. */
export function linesReveal(lines, { delay = 0, stagger = 0.09 } = {}) {
  if (reduced()) return gsap.set(lines, { yPercent: 0 })
  return gsap.fromTo(
    lines,
    { yPercent: 105 },
    { yPercent: 0, duration: 0.95, delay, stagger, ease: EASE.expo }
  )
}

/** Hairline that draws itself as the section arrives. */
export function lineReveal(targets, { delay = 0, duration = 0.9, origin = 'left' } = {}) {
  gsap.set(targets, { transformOrigin: origin })
  if (reduced()) return gsap.set(targets, { scaleX: 1 })
  return gsap.fromTo(
    targets,
    { scaleX: 0 },
    { scaleX: 1, duration, delay, ease: EASE.expo }
  )
}

/** Image mask wipe — reveals from the bottom edge up. */
export function imageReveal(targets, { delay = 0, duration = 0.95 } = {}) {
  if (reduced()) return gsap.set(targets, { clipPath: 'inset(0 0 0% 0)' })
  return gsap.fromTo(
    targets,
    { clipPath: 'inset(0 0 100% 0)' },
    { clipPath: 'inset(0 0 0% 0)', duration, delay, ease: EASE.expo }
  )
}

/**
 * Scrubbed vertical progress line — the red line that "travels between the
 * principles" as the user scrolls. Returns the ScrollTrigger so callers can
 * kill it on unmount.
 */
export function progressLine(lineEl, triggerEl) {
  if (!lineEl || !triggerEl) return null
  if (reduced()) {
    gsap.set(lineEl, { scaleY: 1, transformOrigin: 'top' })
    return null
  }
  gsap.set(lineEl, { scaleY: 0, transformOrigin: 'top' })
  const tween = gsap.to(lineEl, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top 72%',
      end: 'bottom 62%',
      scrub: 0.6,
    },
  })
  return tween.scrollTrigger
}

/** Gentle parallax. Kept small — the brief warns against excessive parallax. */
export function parallax(target, { distance = 60, trigger } = {}) {
  if (!target || reduced()) return null
  const tween = gsap.fromTo(
    target,
    { yPercent: -distance / 10 },
    {
      yPercent: distance / 10,
      ease: 'none',
      scrollTrigger: {
        trigger: trigger || target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  )
  return tween.scrollTrigger
}

/** Count a number up when it scrolls into view (metric blocks). */
export function countUp(el, to, { duration = 1.4, suffix = '', prefix = '' } = {}) {
  if (!el) return null
  if (reduced()) {
    el.textContent = `${prefix}${to}${suffix}`
    return null
  }
  const obj = { v: 0 }
  return gsap.to(obj, {
    v: to,
    duration,
    ease: EASE.out,
    onUpdate: () => {
      el.textContent = `${prefix}${Math.round(obj.v)}${suffix}`
    },
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  })
}

/** Call after route changes / late image loads so pinned triggers stay honest. */
export const refreshScroll = () => ScrollTrigger.refresh()
