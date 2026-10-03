import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Providers from './Providers'
import { ROUTES } from './routes'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/footer/Footer'
import PageTransition from '../components/loaders/PageTransition'

export default function App() {
  return (
    <Providers>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <PageTransition />
      <Navbar />

      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </Providers>
  )
}

/**
 * Shown while a split route chunk loads. Deliberately a dark block of the
 * right height rather than a spinner — the next page's hero is dark, so this
 * reads as the page arriving rather than as a loading interruption.
 */
function RouteFallback() {
  return (
    <div className="surface-void grid min-h-[70svh] place-items-center" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <span aria-hidden className="relative block h-px w-24 overflow-hidden bg-white/15">
        <span
          className="absolute top-0 h-px w-8 bg-red"
          style={{ animation: 'fm-flow-x 1.1s linear infinite' }}
        />
      </span>
    </div>
  )
}
