# NRTH website

NRTH Inc.’s portfolio at nrth.group. Astro pre-renders 26 public pages; the Vercel adapter serves inquiry delivery and private editorial previews. All nine ventures have distinct, working concept demonstrations using clearly labeled sample data.

## Development

Requires Node 22.12+; verified with Node 24.19.

```sh
cd /workspace/nth-group-website
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 4173
```

Saving source files updates the development browser immediately. Stop the development server before type-checking or building because Astro/Vite share caches. A build generates the company PDF, canonical wordmarks, page-specific social images, and a content-revision manifest before rendering pages.

```sh
npm run check
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

`preview` serves the actual built static files and Vercel Node handler. Deployable output is `.vercel/output`, rather than a standalone `dist` directory. Run the browser checks against this preview:

```sh
npm run test:services
npm run test:geometry
npm run test:smoke
npm run test:motion
npm run test:composition
npm run test:experience
```

Playwright uses `/usr/bin/chromium`; override `CHROMIUM_PATH` or `NRTH_TEST_URL` as needed. Experience checks enable Chromium’s software WebGL and mask its driver label to exercise the 3D path; production selects the lighter renderer for known software graphics. These checks establish function and layout, rather than hardware performance. Screenshots and results live in ignored `artifacts` directories. Service tests use a mocked provider and send no email.

## Identity and motion

`src/data/brand.ts` contains the four canonical letter contours traced from the supplied NRTH logo, including its open R. The masthead, footer, favicon, downloads and social graphics use these paths.

The **Living Fold** homepage opens with “Progress unfolds.” on an ivory surface. Three sampled sheets unfold into the mobility landscape through native, reversible scrolling. Six plain-word field choices reshape those same sheets into an embrace, framework, cellular form, gathering space or research fan. A selection interrupted by another starts from its exact current surface mixture. There are no stage counters or arrow CTAs in the showcase. The signature sequence is 285 viewport heights on desktop and 260 on mobile, with all nine ventures two actions from the masthead.

The geometry lives in `src/scripts/fold-geometry.ts`; the director is `fold.ts`. `fold-webgl.ts` provides physically shaded, thin solid surfaces with environmental lighting and floor shadows. `fold-canvas.ts` retains the same geometry when WebGL is unavailable, lost or software-rendered. Rendering stops when settled, offscreen or hidden. Pause, reduced motion, no JavaScript and complete graphics failure use original static artwork with a natural reading layout. Responsive WebP images are generated from the six `src/assets/fold-*.png` originals. Labs retains its separate, manually controlled four-strand experiment; edit that study in `src/data/geometry-source.ts` and run `npm run bake:geometry`.

The supporting pages share the same typography, light palette, imagery and plain-word links. Gallery selection supports keyboard navigation and coordinated artwork transitions into venture pages. See [design-qa.md](design-qa.md) for the reference, implementation captures, review findings and verification evidence.

## Content and operations

See [updating.md](updating.md) for the content map, [cms-setup.md](cms-setup.md) for Sanity editing, and [inquiries.md](inquiries.md) for Resend delivery. Default content describes venture directions, rather than confirmed live capabilities. Unknown stages say “Discuss availability”; owner-confirmed stages require a review date. No customers, financial results, certifications, clinical outcomes, or fundraising terms are invented.

The public pages include Ventures, Company, Approach, Journal, Investors, Contact, Mobility, Partnerships, Research, and Press. Established `/projects` and `/insights` URLs remain intact. Canonicals, structured data, sitemap, robots directives, article attribution, and tailored social previews target `https://nrth.group`. Private previews and API routes are excluded from indexing.

Code publishes through the connected `21ar/nth-group-website` → `nrth1/nrth` workflow. Branches produce previews; successful `main` deployments update production. Sanity publishing can queue a rebuild through an authenticated webhook. HTML, PDF, and revision metadata use one frozen content snapshot per build; Vercel’s immutable deployments retain that output for rollback. Do not commit credentials or account state.
