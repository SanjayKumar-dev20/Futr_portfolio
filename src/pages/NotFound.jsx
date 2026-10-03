import PageHero from '../components/sections/PageHero'
import { PrimaryCTA, SecondaryCTA } from '../components/buttons'
import { useSeo } from '../lib/seo'

export default function NotFound() {
  useSeo({
    title: 'Page not found | Futr Markets',
    description: 'That route does not exist.',
    path: '/404',
  })

  return (
    <PageHero
      eyebrow="404"
      lines={['This route', { text: "doesn't connect.", accent: true }]}
      body="The page you were looking for isn't part of the network. Head back to base and pick a direction."
      align="center"
    >
      <PrimaryCTA to="/" size="lg">
        Back to Base
      </PrimaryCTA>
      <SecondaryCTA to="/talk" size="lg">
        Talk to Us
      </SecondaryCTA>
    </PageHero>
  )
}
