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

Playwright uses `/usr/bin/chromium`; override `CHROMIUM_PATH` or `NRTH_TEST_URL` as needed. Composition and experience checks enable Chromium’s software WebGL and mask its driver label to exercise the 3D path; production selects the lighter renderer for known software graphics. These checks establish function and layout, rather than hardware performance. Screenshots and results live in ignored `artifacts` directories. Service tests use a mocked provider and send no email.

## Identity and motion

`src/data/brand.ts` contains the canonical four contours traced from the supplied NRTH logo, including its open R. Header, footer, static opening, favicon, downloads, social graphics, and animated geometry use these letterforms. Edit pose geometry in `src/data/geometry-source.ts`, then run `npm run bake:geometry`.

One progressive Three.js scene turns N–R–T–H into rings, infinity, and six field symbols. Matched contours, periodic cubic interpolation, quintic blending, tubular surfaces, and environmental reflections keep the material continuous. Native scroll works in both directions; the timeline carries geometry, palette, and chapter selection. Current copy stays readable at every resting scroll position. The track is 450 viewport heights on desktop and 400 on mobile; a fixed header and direct venture links remain available.

WebGL loads dynamically on the homepage. A Canvas renderer handles unavailable graphics, known software rasterizers, or context loss. Software graphics selects that renderer before the first animated paint. Both paths use the same poses and timeline. Pause and reduced motion use the compact canonical SVG, without automatic sculpture animation. Labs is a separate, manually controlled form study. Rendering stops while hidden or offscreen, the opening rests without input, and WebGL adapts resolution when sustained frames are slow. The gallery retains directional transitions, keyboard selection, and artwork continuity into detail pages.

## Content and operations

See [updating.md](updating.md) for the content map, [cms-setup.md](cms-setup.md) for Sanity editing, and [inquiries.md](inquiries.md) for Resend delivery. Default content describes venture directions, rather than confirmed live capabilities. Unknown stages say “Discuss availability”; owner-confirmed stages require a review date. No customers, financial results, certifications, clinical outcomes, or fundraising terms are invented.

The public pages include Ventures, Company, Approach, Journal, Investors, Contact, Mobility, Partnerships, Research, and Press. Established `/projects` and `/insights` URLs remain intact. Canonicals, structured data, sitemap, robots directives, article attribution, and tailored social previews target `https://nrth.group`. Private previews and API routes are excluded from indexing.

Code publishes through the connected `21ar/nth-group-website` → `nrth1/nrth` workflow. Branches produce previews; successful `main` deployments update production. Sanity publishing can queue a rebuild through an authenticated webhook. HTML, PDF, and revision metadata use one frozen content snapshot per build; Vercel’s immutable deployments retain that output for rollback. Do not commit credentials or account state.
