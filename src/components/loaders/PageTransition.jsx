import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from '../../hooks'

/**
 * Route transition: a graphite layer sweeps down across the viewport, edged in
 * Futr Red, and continues straight off the bottom.
 *
 * 560ms total — inside the brief's 400–700ms window, and explicitly *not* a
 * "slow cinematic transition that delays navigation": the route has already
 * swapped underneath before the layer even reaches full coverage. Driven by a
 * CSS keyframe rather than staged React state so it cannot desync.
 */
const DURATION = 560

export default function PageTransition() {
  const { pathname } = useLocation()
  const prefersReduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (prefersReduced) return

    setRun((n) => n + 1)
    const t = setTimeout(() => setRun(0), DURATION)
    return () => clearTimeout(t)
  }, [pathname, prefersReduced])

  if (!run) return null

  return (
    <div
      // Remounting on each run restarts the keyframe cleanly.
      key={run}
      aria-hidden
      className="page-wipe"
      style={{ animation: `fm-page-wipe ${DURATION}ms var(--ease-in-out-quart) forwards` }}
    >
      <span className="page-wipe__line" style={{ top: 0 }} />
      <span className="page-wipe__line" style={{ top: 'auto', bottom: 0 }} />
    </div>
  )
}
