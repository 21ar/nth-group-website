# NRTH website

A static Astro website for NRTH Inc. at nrth.group, with nine project pages, a continuous N–R–T–H-to-industry brand story, a nine-venture interactive showcase, a visual searchable project directory, rich project pages, perspectives, and contact flows.

## Development

Use the existing isolated checkout; no additional worktree is needed. Requires Node 22.12+ (verified with Node 24.19).

```sh
cd /workspace/nth-group-website
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 4173
```

Keep the process running during development. Do not build concurrently with the dev server: both use Astro/Vite caches. Stop the server first, then validate:

```sh
npm run check
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

The build produces 21 HTML pages in `dist`, plus generated image assets and sitemap files. A static host should serve directory index files, use `404.html` for missing routes, compress responses, and cache hashed assets for a year while keeping HTML caching short.

With the server running, `npm run test:smoke` verifies motion, navigation, search, all project routes, contact preparation/download/routing, keyboard focus, reduced motion, and content without JavaScript. It uses `/usr/bin/chromium`; override `CHROMIUM_PATH` and `NRTH_TEST_URL` when needed. Screenshots and results are written to the ignored `artifacts/verified` directory. `npm run test:motion` adds 65 checks for reversible story states, gallery transitions, pointer response, compact pause/reduced motion, mobile interaction, heading visibility, and responsive overflow; its evidence lives in `artifacts/brand-story`. `npm run test:geometry` checks 44 intermediate letter-to-ring contours for folding/self-intersection. Acceptance targets are recorded in `motion-goals.md`.

## Content and identity

Edit shape definitions in `src/data/geometry-source.ts`, then run `npm run bake:geometry` to rebuild the quantized asset. Baking requires the same Chromium used for browser checks; visitors download the compact geometry and do not calculate SVG metrics or phase alignment.

Edit project information in `src/data/projects.ts`, detailed capabilities and workflows in `src/data/project-details.ts`, and practical scenarios, briefing prompts, and tailored FAQs in `src/data/project-scenarios.ts`, and perspectives in `src/data/articles.ts`. Nine original venture artworks live in `src/assets`; their mapping is in `src/data/visuals.ts`. Astro generates responsive WebP images for publication. The project scope is proposed editorial copy; confirm actual capabilities before publishing. No customer counts, certifications, clinical outcomes, or live-product availability have been invented.

`public/images/nrth-logo.png` is a transparent derivative of the supplied NRTH attachment made with image generation, rather than the original vector export. Replace it with the original SVG or transparent artwork for exact identity fidelity. The wireform and social artwork are generated assets. Reference website imagery is not included in the application.

The opening draws N–R–T–H as four persistent silver strands. Those letterforms become rings, infinity, then six industry symbols before returning to infinity. Health, Mobility, Systems, Materials, Events and Exploration group all nine ventures; edit the story in `src/data/industries.ts` and `src/components/KineticHero.astro`.

One Canvas 2D renderer projects three-dimensional curves on desktop and touch. Equal arc-length sampling, phase alignment, quintic interpolation and periodic cubic splines avoid image handoffs and sharp ring corners. Drawing uses a bounded raster surface, depth ordering, chrome gradients and travelling connection points. Sustained slow frames lower raster resolution and cap sculpture drawing at about 30 fps, keeping the same geometry while the interface retains native frame scheduling. Native scroll remains reversible; pointer movement adjusts perspective, industry controls navigate the same timeline, and ring bullets become underlines on hover. The neutral palette moves from warm paper into ink and back. Original supporting artwork is in `src/assets/connection-art.png`.

Rendering stops when hidden/offscreen and is omitted for reduced motion or the visitor's pause setting. Static N–R–T–H remains available without JavaScript. No Three.js dependency or client chunk is included. Project selection retains its moving indicator, directional artwork wipe and staggered copy. Supported browsers carry artwork into the detail page with native cross-document View Transitions; ordinary links remain the fallback. `motion-reference-notes.md` records actual reference inspection, including the accessible DIA Coinbase/Base case study.

## Inquiries

General and project inquiries default to `hello@nrth.group`; partnerships use `partnerships@nrth.group`. Activate these inboxes or aliases before launch. Optional build-time overrides are documented in `.env.example`.

The contact flow prepares a message locally for review, copying, download, or sending through the visitor's email app. It does not submit to a backend, create mailboxes, or confirm delivery. A hosted submission endpoint can be added separately if direct web delivery is required.

## Launch

Permanent production deployment: https://nrth-rgr8ebkbv-nrth1.vercel.app, in Vercel project `nrth1/nrth`. `nrth.group` is assigned to this deployment, pending Cloudflare DNS correction; `www.nrth.group` is configured to redirect to the apex with HTTP 308. Anonymous previews expire after one hour unless claimed; redeploying an existing anonymous project preserves its original expiry. The permanent Vercel production site has been updated; Cloudflare DNS has not been changed. Review project copy, original logo artwork, contact destinations, and privacy/terms language before publishing. Add actual product screenshots as they become available. Canonicals, page metadata, social previews, structured data, robots.txt, and XML sitemaps target `https://nrth.group`; search rankings cannot be guaranteed.

## Validation evidence

The build emits 21 pages and two small client script chunks. Current validation results and performance evidence are recorded in `design-qa.md`, `artifacts/brand-story` and `artifacts/verified`; run `npm run check`, `npm run build`, `npm run test:smoke` and `npm run test:motion` against the production preview to reproduce checks. Local Lighthouse and frame timings are lab observations, not field measurements or ranking guarantees.

Visual QA and resolved findings are documented in `design-qa.md`. Vercel configuration is in `vercel.json`; temporary previews use Vercel CLI 62 with `vercel deploy --temporary --yes`. Public HTTPS readiness is checked with normal certificate verification. Hosted Chromium navigation remains limited by cloud proxy certificate trust; functional browser evidence comes from the local production build.

The opening animation uses hand-traced outlines from the supplied logo, including its open R counter, rather than generic letterforms. The renderer has no contour shadow or duplicate highlight stroke. `npm run test:composition` checks 114 keyframe/intermediate layouts across six screen sizes, reserving actual copy and control bounds for the sculpture. Materials uses three distinct orbital planes and a fourth nucleus ring; the geometry test rejects duplicate silhouettes.

## Investors

`/investors` introduces the company perspective, six portfolio fields, nine venture links, and investor questions. It is linked from the header, mobile menu, footer, and homepage. `/contact?project=investor` selects Investor inquiry and routes its prepared email to `PUBLIC_INVESTORS_EMAIL`, defaulting to `investors@nrth.group`. This address must be provisioned separately like the other contact mailboxes. `node verify-investors.cjs` checks navigation, responsive layout, visible portfolio reveals, and investor inquiry preparation/routing. No financial results or fundraising terms are asserted.

## Editing and publishing

See `updating.md` for the live-edit workflow and content map. Run `npm run dev` for instant browser updates on save. The homepage opening and investor introduction are centralized in `src/data/site-content.ts`. GitHub Actions checks source and production builds. Automatic Vercel previews and production builds are pending the GitHub Login Connection required by Vercel. The favicon uses the canonical hand-traced NRTH wordmark with a versioned SVG URL to avoid the previous padded raster icon.
