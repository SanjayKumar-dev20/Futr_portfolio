import { useEffect } from 'react'

/**
 * Per-route document head.
 *
 * Deliberately not react-helmet: this is a small static site, every page has
 * exactly four tags to set, and a 12kB dependency to do four `setAttribute`
 * calls is not a trade worth making.
 */
const SITE = import.meta.env.BASE_URL === '/'
  ? 'https://futrmarkets.com'
  : new URL(import.meta.env.BASE_URL, window.location.origin).href.replace(/\/$/, '')

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo({ title, description, path = '/', image = '/og.jpg' }) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description })
      upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: description,
      })
    }

    if (title) {
      upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    }

    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: `${SITE}${path}` })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: `${SITE}${image}` })
    upsertLink('canonical', `${SITE}${path}`)
  }, [title, description, path, image])
}
