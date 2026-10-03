import { lazy } from 'react'
import Home from '../pages/Home'

/**
 * Home is imported eagerly — it is the landing route and the one the client
 * will judge, so it must not wait on a second round trip. Everything else is
 * split, which keeps the initial JS to the shell plus Home.
 */
const Difference = lazy(() => import('../pages/Difference'))
const Grow = lazy(() => import('../pages/Grow'))
const Manufacturers = lazy(() => import('../pages/Manufacturers'))
const FutrX = lazy(() => import('../pages/FutrX'))
const Shop = lazy(() => import('../pages/Shop'))
const Pulse = lazy(() => import('../pages/Pulse'))
const Invest = lazy(() => import('../pages/Invest'))
const Talk = lazy(() => import('../pages/Talk'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Privacy = lazy(() => import('../pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('../pages/Legal').then((m) => ({ default: m.Terms })))

export const ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/difference', element: <Difference /> },
  { path: '/grow', element: <Grow /> },
  { path: '/manufacturers', element: <Manufacturers /> },
  { path: '/futr-x', element: <FutrX /> },
  { path: '/shop', element: <Shop /> },
  { path: '/pulse', element: <Pulse /> },
  { path: '/invest', element: <Invest /> },
  { path: '/talk', element: <Talk /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  { path: '*', element: <NotFound /> },
]
