import { useEffect, useRef, useState } from 'react'
import StaticNetwork from '../../scenes/StaticNetwork'
import { useIsSmallScreenMedia, useReducedMotion } from '../../hooks'

/**
 * Full-bleed looping hero video.
 *
 * Rules it has to obey, in order of how badly each one bites:
 *
 *  · Reduced motion gets the static SVG network instead. Not a paused video —
 *    a background loop is exactly the kind of ambient movement that preference
 *    exists to stop, and the first frame of this clip is nearly black.
 *  · Autoplay only works muted + playsInline. Safari on iOS additionally
 *    refuses unless `playsInline` is a real attribute, which React does set.
 *  · `play()` returns a promise that rejects when a policy blocks it. If that
 *    happens we fall back rather than sitting on a black box.
 *  · Paused when scrolled away. A decoding 1600px video behind four screens of
 *    content is pure battery cost.
 *  · `preload="none"` until the element is actually near the viewport, so the
 *    2.4 MB never competes with the fonts and the hero copy for bandwidth.
 */
const cancelIdle = (id) => {
  if (id == null) return
  if ('cancelIdleCallback' in window) cancelIdleCallback(id)
  else clearTimeout(id)
}

export default function HeroVideo({
  src = `${import.meta.env.BASE_URL}video/hero-loop.mp4`,
  srcSmall = `${import.meta.env.BASE_URL}video/hero-loop-sm.mp4`,
  poster = `${import.meta.env.BASE_URL}video/hero-poster.webp`,
  className = '',
}) {
  const prefersReduced = useReducedMotion()
  // 820px rather than the usual breakpoint: this is about bandwidth, not
  // layout, and anything narrower than a small tablet gets the 0.8 MB cut.
  const small = useIsSmallScreenMedia()
  const chosen = small ? srcSmall : src

  const hostRef = useRef(null)
  const videoRef = useRef(null)

  const [near, setNear] = useState(false) // cleared to start fetching
  const [visible, setVisible] = useState(false) // actually on screen
  const [canPlay, setCanPlay] = useState(false) // has enough data to paint
  const [failed, setFailed] = useState(false)

  /*
    Visibility: cheap, immediate.
  */
  useEffect(() => {
    const el = hostRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const play = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.01,
    })
    play.observe(el)
    return () => play.disconnect()
  }, [])

  /*
    Fetching: deliberately deferred until the page has finished loading and the
    main thread goes idle.

    The hero is at the top of the document, so an IntersectionObserver would
    fire instantly and put a 1.5 MB video in the same bandwidth queue as the
    font, the CSS and the first two photographs — on a mid-range connection
    that pushed first contentful paint out measurably. The poster is a real
    frame of this clip and is preloaded at high priority, so the hero looks
    finished within a few hundred milliseconds either way; the video just
    takes over once nothing is waiting on it.
  */
  useEffect(() => {
    if (prefersReduced) return

    let idle
    const start = () => {
      idle = 'requestIdleCallback' in window
        ? requestIdleCallback(() => setNear(true), { timeout: 2500 })
        : setTimeout(() => setNear(true), 400)
    }

    if (document.readyState === 'complete') {
      start()
      return () => cancelIdle(idle)
    }
    window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      cancelIdle(idle)
    }
  }, [prefersReduced])

  useEffect(() => {
    const v = videoRef.current
    if (!v || prefersReduced || failed) return

    if (visible && near) {
      const attempt = v.play()
      // Older browsers return undefined rather than a promise.
      if (attempt?.catch) attempt.catch(() => setFailed(true))
    } else {
      v.pause()
    }
  }, [visible, near, prefersReduced, failed])

  const useVideo = !prefersReduced && !failed

  if (!useVideo) {
    return (
      <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
        <StaticNetwork className="h-full w-full" />
      </div>
    )
  }

  return (
    <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
      {/*
        The poster is a real <img> rather than the video's `poster` attribute.
        It is preloaded at high priority in index.html, and Chrome only credits
        a `rel=preload as=image` against an actual image element — against a
        video poster it warns that the preload went unused on every single
        load. Same single fetch either way; this just keeps the console clean
        and lets the still crossfade into the footage instead of cutting.
      */}
      <img
        src={poster}
        alt=""
        aria-hidden
        fetchPriority="high"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 [transition-timing-function:var(--ease-out-quint)] ${
          canPlay ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <video
        ref={videoRef}
        preload={near ? 'auto' : 'none'}
        src={near ? chosen : undefined}
        muted
        loop
        playsInline
        autoPlay
        disablePictureInPicture
        aria-hidden
        tabIndex={-1}
        onCanPlay={() => setCanPlay(true)}
        // Only meaningful once a src exists. Before `near` the element is
        // deliberately srcless, and some browsers fire `error` on an empty
        // media element — which would latch the fallback on permanently
        // before the video ever got a chance.
        onError={near ? () => setFailed(true) : undefined}
        className={`relative h-full w-full object-cover transition-opacity duration-700 ${
          canPlay ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
