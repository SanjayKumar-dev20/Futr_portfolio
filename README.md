# Futr Markets — Website

Corporate / brand portfolio site for Futr Markets.
Built from `Futr_Markets_Full_Website_Development_Plan.md`, the approved home-page
comp, and the client's feedback of 28 Sep 2026.

```
npm install
npm run fetch:images     # download the photography set (JPEG) into public/images
npm run optimize:images  # → WebP at per-slot sizes (5.5 MB → 1.8 MB)
npm run optimize:video   # hero loop → 1.4 MB mp4 + 0.8 MB mobile cut + poster
npm run dev              # http://localhost:5173
npm run build            # production build → dist/
npm run preview          # serve dist/
```

> If port 5173 is busy: `npm run dev -- --port 5180`.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 19 + Vite 6 | per the plan |
| Styling | Tailwind CSS v4 + one global CSS layer | per the plan |
| Type | Montserrat Variable (self-hosted) | it is the brand face — see below |
| Hero visual | Client-supplied 3D video loop | see below |
| Motion | GSAP + ScrollTrigger, CSS reveals, Lenis | CSS for the common case, GSAP for scrubbed work |
| Routing | React Router 7 | route-level code splitting |

**Three.js is in `package.json` but not in the bundle.** The home hero was
originally a WebGL market network; the client then supplied a rendered 3D loop
of the same subject — a dark globe wrapped in a red node lattice. Running both
would have put two globes on one screen, so the hero is now the video.
`src/scenes/` keeps `SceneCanvas` and `MarketNetwork` for the Difference and
Invest scenes the plan calls for, and because nothing imports them today
Rollup drops Three.js entirely. That is ~885 kB raw / 240 kB gzipped off the
landing route. Note the comment on `manualChunks` in `vite.config.js` before
re-adding it: naming a package there forces it into the bundle whether or not
anything imports it. (The same mistake with drei cost ~700 kB earlier.)

---

## Brand

Red and black are **measured from the client's logo artwork**, not guessed. The
supplied `Futr Markets Logo.pdf` is a Canva export; decoding its CMYK plate
gives:

| Token | Value | Source |
|---|---|---|
| `--color-red` | `#FF0B2A` | the logo dot |
| `--color-ink` | `#000000` | the wordmark |

The plan document's suggested `#E51B2B` was a placeholder and is **not** used.

The same PDF embeds `Montserrat-Bold` (for "Futr") and `Montserrat-Light` (for
"MARKETS"), which settles the client's font question — Montserrat is already
their brand face. `src/components/brand/Logo.jsx` rebuilds the wordmark in live
Montserrat at the measured proportions, so it stays crisp at any size and the
light/dark variants swap cleanly.

Full token set: `src/styles/globals.css`.

---

## Structure

```
src/
├── app/            App shell, routes, Lenis + store subscriptions
├── components/
│   ├── brand/      Logo
│   ├── navigation/ Navbar + full-screen mobile menu
│   ├── footer/
│   ├── buttons/    PrimaryCTA · SecondaryCTA · TextLink · CircleArrow
│   ├── system/     Container · Section · RevealOnScroll · headings · backdrops
│   ├── media/      ImageFrame · CutoutFigure
│   ├── graphics/   SystemDiagram (isometric)
│   ├── sections/   PageHero · RoadmapOutline
│   ├── icons/
│   └── loaders/    PageTransition
├── scenes/         SceneCanvas (gatekeeper) + MarketNetwork (the hero globe)
├── animations/     GSAP helpers
├── hooks/
├── data/           navigation · images · clients
├── lib/            seo
├── pages/
└── styles/         globals (+ animations, utilities via cascade layers)
```

### Cascade layers — read this before adding CSS

`globals.css` imports `animations.css` and `utilities.css` **into the
`components` layer**:

```css
@import './animations.css' layer(components);
@import './utilities.css'  layer(components);
```

This is load-bearing. Unlayered CSS outranks every layered rule, so a plain
`.img-frame { position: relative }` silently beats Tailwind's `absolute`
utility at the call site. Keep new component CSS inside those files (or inside
an explicit `@layer components` block) — do not add a third unlayered
stylesheet.

### IntersectionObserver — read this before adding a reveal

Never put `clip-path`, `scale(0)` or anything else that collapses the box on
the element you are observing. The intersection rect is computed after those
apply, so the ratio stays `0`, the observer never fires, and the reveal waits
on itself forever. Animate an inner wrapper — `ImageFrame` and
`RevealOnScroll`'s `mask`/`line` variants both do this.

---

## Media pipeline

Both pipelines use `ffmpeg-static` (a devDependency — no system install needed).

**Photography.** `npm run fetch:images` downloads JPEGs into `public/images/`;
`npm run optimize:images` converts them to WebP at the width each slot actually
renders at (`WIDTHS` in the script). The JPEGs are build inputs and are
gitignored; the WebP files are the deliverables. Every path resolves through
`src/data/images.js`, so replacing the set means dropping files with the same
basenames in and re-running the optimizer. See `HANDOVER.md` for the shot list
and the cut-out photography direction.

**Hero video.** The master lives in `video-source/` (outside `public/`, so the
unoptimised 10.7 MB file is never served). `npm run optimize:video` produces
the desktop mp4, a mobile cut and the poster. To swap the clip:

```
npm run optimize:video -- "C:\path\to\new-clip.mp4"
```

A VP9/WebM variant was tried and rejected — it came out at 4.3 MB against
H.264's 1.5 MB, because the footage is dark and full of fine particles. There
is one output and every browser gets it.

The current set is licensed placeholder photography (Unsplash License, free for
commercial use), chosen against the client's note that the previous comp
"looks like we are a very big company": real Indian owner-operators, small
textile units, kirana shops and handcart logistics.

---

## Performance

Measured on the production build (`npm run preview`), home page, warm server:

| | Before | After |
|---|---|---|
| Page weight | ~4.7 MB | **2.6 MB** |
| `load` event | — | **150 ms** |
| Poster painted | — | **46 ms** |
| Video starts fetching | with everything else | **~1.4 s**, after load |
| Fonts | 168 kB (5 subsets) | **37 kB** |
| Photography | 5.5 MB JPEG | **1.8 MB WebP** |
| Three.js chunk | 885 kB | **removed** |

What does the work:

- **Three.js dropped from the route** (see above) — the single biggest win.
- **Fonts cut to Latin.** `@fontsource-variable/montserrat` has no per-subset
  entry point and was shipping Cyrillic, Cyrillic-ext and Vietnamese on an
  English site. The two Latin files are vendored in `public/fonts/` and
  declared by hand in `globals.css`; `unicode-range` means the 69 kB latin-ext
  half only downloads if a page actually needs it. The 37 kB Latin file is
  preloaded because the hero headline is 800-weight Montserrat.
- **Photography converted to WebP** at per-slot sizes — a split panel paints at
  715px on desktop, so it does not need a 1600px source. The home page's
  heaviest image went from 1112 kB to 277 kB.
- **The hero video is deferred to idle.** It sits at the top of the document,
  so an IntersectionObserver fired instantly and put 1.5 MB in the same queue
  as the font, CSS and first photographs. It now waits for `load` + idle. The
  poster — a real frame of the clip, preloaded at high priority — carries the
  hero in the meantime and crossfades out when the video can play.
- **Video is paused when scrolled away**, and a 0.8 MB cut is served under
  820px rather than the 1.4 MB desktop file.
- **Lenis runs on `lerp`, not `duration`.** A duration-based config restarts a
  ~1 s eased animation on every wheel event, so the viewport permanently trails
  the input — which reads as "the site is slow" even at a locked 60 fps.
- Home is eager; every other route is code-split.

### If you need to re-measure

`requestAnimationFrame` is throttled to ~1 fps when the page is backgrounded,
so any FPS number collected from an automated/headless context is meaningless
unless the page is genuinely foregrounded. Likewise, driving `window.scrollTo`
in a loop fights Lenis's lerp and will under-report both frame rate and
scroll-triggered reveals. Prefer the resource-timing and navigation-timing
numbers above; they are stable.

## Runtime configuration

`public/config.json` is read at startup and is the source of truth for the
contact-form backend. It is a plain file next to `index.html` that the client
edits **on the server** — no rebuild, no CLI, no Node.

That matters because `VITE_*` variables are inlined at build time: setting one
on a host does nothing to an already-built bundle. `VITE_*` is still honoured
as a fallback for CI/preview deploys where a rebuild happens anyway, but
`config.json` wins.

Client-facing instructions: **`CONTACT-FORM-SETUP.md`** (written for a
non-developer — creating the Google Sheet, deploying the Apps Script, editing
two values).

The file is served `no-cache` in both `_headers` and `vercel.json`, or a CDN
would cache the client's edit away and it would look like it had not worked.

## Security

Full assessment in `SECURITY.md`. In short: a static site with no server, no
auth and no payments, so the real surface is the contact form, the dependency
chain and the response headers.

- Contact form carries a honeypot and a timing gate, both verified to block
  bot submissions with zero network calls, and neither visible to a real user.
- `npm audit` clean, no secrets in the bundle, no raw HTML rendering anywhere.
- Security headers ship ready to use — `public/_headers` (Netlify/Cloudflare)
  and `vercel.json` (Vercel). **Copy them if you host elsewhere.**
- `VITE_*` env vars are **public** — inlined into the bundle at build time.
  Never put a secret in one.

## Accessibility

- Skip link, semantic landmarks, one `<h1>` per route.
- `prefers-reduced-motion` is honoured end to end: no Lenis,
  no WebGL (a static SVG network stands in), and every reveal resolves to its
  final state rather than just running faster.
- Form fields carry persistent labels, `aria-invalid`, and `aria-describedby`;
  submission moves focus to the first error.
