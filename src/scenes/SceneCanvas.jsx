import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useIsTablet, useIsTouch, usePointer, useReducedMotion } from '../hooks'
import StaticNetwork from './StaticNetwork'

/**
 * NOTE: nothing renders this right now. The Home hero moved to the client's
 * supplied video loop, which shows the same subject — two globes on one screen
 * would be absurd, and dropping WebGL from the landing route took ~240 kB
 * (gzipped) off it.
 *
 * It is kept because the plan calls for Three.js scenes on The Futr Difference
 * and Invest Futr, and this is their foundation. While it is unimported,
 * Three.js is tree-shaken out of the bundle entirely — see the note on
 * `manualChunks` in vite.config.js before re-adding it.
 */

const Canvas = lazy(() =>
  import('@react-three/fiber').then((m) => ({ default: m.Canvas }))
)
const MarketNetwork = lazy(() => import('./MarketNetwork'))

/**
 * Gatekeeper for the 3D layer.
 *
 * Nothing here loads until all of these are true:
 *   · the user has not asked for reduced motion
 *   · WebGL is actually available
 *   · the canvas is on screen
 *
 * Until then — and permanently, for reduced-motion users — a static SVG
 * network stands in. It is the same composition, just not moving, so the hero
 * never collapses to an empty black box.
 */
export default function SceneCanvas({ className = '' }) {
  const prefersReduced = useReducedMotion()
  const isTablet = useIsTablet()
  const isTouch = useIsTouch()

  const hostRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [webgl, setWebgl] = useState(null)

  const pointer = usePointer({ enabled: !isTouch && !prefersReduced })

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setWebgl(
        Boolean(
          window.WebGLRenderingContext &&
            (c.getContext('webgl2') || c.getContext('webgl'))
        )
      )
    } catch {
      setWebgl(false)
    }
  }, [])

  // Mount on entry, and pause the render loop when scrolled away.
  useEffect(() => {
    const el = hostRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '220px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const use3D = webgl === true && !prefersReduced

  return (
    <div ref={hostRef} className={`relative ${className}`}>
      {use3D && visible ? (
        <Suspense fallback={<StaticNetwork />}>
          <Canvas
            camera={{ position: [0, 0, 6.2], fov: 42 }}
            dpr={[1, isTablet ? 1.5 : 2]}
            gl={{ antialias: !isTablet, alpha: true, powerPreference: 'high-performance' }}
            // `demand` would freeze the pulses; `always` is correct here, and
            // the IntersectionObserver above stops it when off screen.
            frameloop={visible ? 'always' : 'never'}
            style={{ background: 'transparent' }}
          >
            <MarketNetwork
              density={isTablet ? 'low' : 'high'}
              pointer={pointer}
              paused={!visible}
            />
          </Canvas>
        </Suspense>
      ) : (
        <StaticNetwork />
      )}
    </div>
  )
}
