import WireGlobe from '../components/graphics/WireGlobe'

/**
 * Hero stand-in for wherever the moving version can't or shouldn't run:
 * reduced-motion users, blocked autoplay, no WebGL.
 *
 * Geometry lives in WireGlobe — this is only the hero framing of it. The
 * footer mark renders the same primitive with a different variant.
 */
export default function StaticNetwork({ className = '' }) {
  return (
    <div className={`grid h-full w-full place-items-center ${className}`}>
      <WireGlobe variant="hero" id="fm-hero-globe" className="h-full max-h-[44rem] w-auto" />
    </div>
  )
}
