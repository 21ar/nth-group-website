# NRTH — Build beyond.

NRTH Inc.’s portfolio for nrth.group. Astro pre-renders 26 public pages; the Vercel adapter handles inquiry delivery and private editorial previews. The Matterfield design uses graphite, chrome, orange and oversized typography, with a continuous, interactive 3D identity and new editorial content.

## Develop and review

Requires Node 22.12+; verified with Node 24.19. Use the existing checkout and preserve working changes. Cloud tasks already have an isolated environment.

```sh
cd /workspace/nth-group-website
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev -- --host 0.0.0.0 --port 4173
```

Saving source files updates the development browser through hot reload. Stop your development server before checking or building because Astro/Vite share caches. The build generates canonical logo resources, a company PDF, social images and a content-revision manifest from one frozen content snapshot.

```sh
npm run check
npm run test:geometry
npm run test:services
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

`preview` serves the built static pages and actual Vercel Node handler. Deployable output lives in `.vercel/output`. In a second terminal, run `npm run test:browser`. Playwright requires `/usr/bin/chromium`; override `CHROMIUM_PATH` or `NRTH_TEST_URL` as needed. The browser suite uses Chromium’s identified software WebGL renderer, without masking its driver. It checks behavior, composition and exported media; it does not benchmark physical GPUs. Service checks use a mocked provider, and browser checks mock inquiry failure. Neither sends email. Captures and reports are generated in ignored `artifacts` directories.

The separate Sanity Studio supports `npm run check` and `npm run build` from `studio`. CI bundle validation supplies `SANITY_STUDIO_PROJECT_ID=nrthdemo SANITY_STUDIO_DATASET=production SANITY_CLI_TELEMETRY_DISABLED=1`; those placeholder values do not connect a live editorial account.

## Identity and interaction

`src/data/brand.ts` contains the four canonical letter contours traced from the supplied NRTH logo. The masthead, footer, favicon, downloads and social images use those contours.

The opening chrome mineral consists of one shared population of rounded fragments. Native scrolling disperses it, then reforms the same objects into mobility routes, a care signal, a systems framework, molecular cells, an event spectrum or a branching research form. Reverse scrolling restores earlier geometry; interrupted industry choices begin at the currently displayed mixture. Pointer movement influences the sculpture without replacing ordinary navigation.

The signature sequence is 4.8 viewport heights on desktop and 4.4 on phones, followed by a normal scrolling portfolio. Six plain-word industry choices avoid a compulsory tour. The menu links directly to all nine ventures and Investors. A nine-venture constellation explains possible relationships through highlighted paths and practical handoff stories. Each venture includes its own audience, connected workflow, three changing scenarios and three native questions, with direct section navigation.

The research playground lets visitors morph the common fragment population into six arrangements, adjust structure and perspective, drag to turn, reset, copy a study URL and export the actual rendering as a PNG. A partnership brief builder changes its framing around a challenge, experiment or experience. Visitors can save or copy the outline and carry it into an editable contact inquiry without sending anything automatically. Search, focus explorers, disclosures and journal articles complete the portfolio.

The motion director is `src/scripts/matter.ts`, shared geometry is `matter-geometry.ts`, and the physically shaded renderer is `matter-renderer.ts`. Rendering stops when settled, hidden or outside the scene; smaller devices use fewer instances, and slow rendering reduces resolution. Pause, reduced motion, short landscape screens, no JavaScript and graphics failure retain original artwork and a natural reading layout. Static artwork is stored in `src/assets/matterfield`; Astro generates responsive WebP images. [Research and design targets](design/matterfield/brief.md) and [browser design review](design-qa.md) record the direction and its verification.

Run `npm run test:enrichment` against the production preview for the constellation, nine venture scenarios, partnership handoff and deeper research controls. Both browser suites capture their reviewed states in ignored `artifacts/matterfield/` directories.

## Content and publishing

See [updating.md](updating.md) for editable sources, [cms-setup.md](cms-setup.md) for Sanity editing, and [inquiries.md](inquiries.md) for Resend delivery. Content describes venture directions and invites a conversation about current scope. It does not invent customers, launches, clinical outcomes, financial results or certifications. Confirmed stages and product URLs require approved content.

Established `/projects` and `/insights` routes remain intact. Canonicals, structured data, sitemap, article attribution and tailored social previews target `https://nrth.group`. Private previews and API routes are excluded from indexing. Search metadata supports discovery; ranking depends on content, external signals and indexing.

Code publishing uses the connected `21ar/nth-group-website` → `nrth1/nrth` workflow. Branches generate Vercel review previews; successful `main` deployments update production. CMS publishing can queue a rebuild through an authenticated webhook. Vercel deployments preserve HTML, resources and content revisions together for rollback. Keep credentials in environment settings, never in the repository.
