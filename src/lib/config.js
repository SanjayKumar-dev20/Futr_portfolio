/**
 * Runtime configuration.
 *
 * This exists because of how the site is handed over. The client configures
 * their own form backend *after* the project is delivered, and they are not
 * going to run a build to do it.
 *
 * `VITE_*` variables are inlined at build time — setting one on a server does
 * nothing to an already-built bundle. So the real source of truth is
 * `public/config.json`, which is a plain file sitting next to index.html that
 * can be edited in a text editor, an FTP client or a hosting file manager.
 * Reload the page and the change is live.
 *
 * Resolution order, highest first:
 *
 *   1. public/config.json   — what the client edits. No rebuild required.
 *   2. VITE_* env vars      — for CI/preview deploys where a rebuild happens
 *                             anyway and env vars are more convenient.
 *   3. Built-in defaults    — provider "none", i.e. the mailto fallback.
 *
 * The fetch is fired once at module load and cached, so the file is requested
 * a single time per session and is almost always resolved long before anyone
 * reaches the contact form.
 */

const DEFAULTS = {
  contact: {
    provider: 'none',
    endpoint: '',
    accessKey: '',
  },
}

/** Build-time values, used only where config.json has not set one. */
const fromEnv = {
  provider: import.meta.env.VITE_CONTACT_PROVIDER || '',
  endpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
  accessKey: import.meta.env.VITE_CONTACT_ACCESS_KEY || '',
}

/** Drops the `_`-prefixed documentation keys the JSON file carries. */
const stripDocs = (obj = {}) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !k.startsWith('_')))

const firstNonEmpty = (...values) => values.find((v) => v != null && v !== '') ?? ''

let cached = null

/**
 * @returns {Promise<{ contact: { provider: string, endpoint: string, accessKey: string } }>}
 */
export function loadConfig() {
  if (cached) return cached

  cached = fetch(`${import.meta.env.BASE_URL}config.json`, { cache: 'no-cache' })
    .then((res) => (res.ok ? res.json() : {}))
    .catch(() => ({})) // Missing or malformed file must never break the site.
    .then((file) => {
      const contact = stripDocs(file.contact)
      return {
        contact: {
          provider: firstNonEmpty(
            contact.provider,
            fromEnv.provider,
            DEFAULTS.contact.provider
          ).toLowerCase(),
          endpoint: firstNonEmpty(contact.endpoint, fromEnv.endpoint),
          accessKey: firstNonEmpty(contact.accessKey, fromEnv.accessKey),
        },
      }
    })

  return cached
}

// Warm the cache immediately so the file is in flight during page load rather
// than being fetched at the moment someone presses Send.
if (typeof window !== 'undefined') loadConfig()
