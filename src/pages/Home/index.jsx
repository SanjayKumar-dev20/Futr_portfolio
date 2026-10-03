import Hero from './sections/Hero'
import SplitPanels from './sections/SplitPanels'
import FutrImpact from './sections/FutrImpact'
import CompleteSystem from './sections/CompleteSystem'
import DifferencePreview from './sections/DifferencePreview'
import Opportunity from './sections/Opportunity'
import GrowPreview from './sections/GrowPreview'
import Clientele from './sections/Clientele'
import PulsePreview from './sections/PulsePreview'
import BuildFuture from './sections/BuildFuture'
import HOME from '../../data/content/home'
import { useSeo } from '../../lib/seo'

/**
 * Home — "Base" in the navigation, per the client's note.
 *
 * Section order follows the Creative Framework (pages 12–14): hero, the
 * business/manufacturer split, Futr Impact, The Futr Difference, Let's Grow,
 * Futr Pulse, Be Part of What's Next.
 *
 * Two sections sit outside that list and are kept deliberately: A Complete
 * System (the isometric diagram, which carries the framework's "everything
 * works because everything connects" idea visually) and the trust rail, which
 * the approved comp shows. Both land where the light/dark rhythm needs them:
 *
 *   VOID → VOID → BONE → LIGHT → VOID → VOID → BONE → BONE → LIGHT → VOID
 */
export default function Home() {
  useSeo(HOME.seo)

  return (
    <>
      <Hero />
      <SplitPanels />
      <FutrImpact />
      <CompleteSystem />
      <DifferencePreview />
      <Opportunity />
      <GrowPreview />
      <Clientele />
      <PulsePreview />
      <BuildFuture />
    </>
  )
}
