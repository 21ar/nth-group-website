# NRTH — Build beyond.

NRTH Inc.’s portfolio for nrth.group. Astro pre-renders 32 public pages; the Vercel adapter handles inquiry delivery and private editorial previews. The Matterfield design uses graphite, chrome, orange and oversized typography, with a continuous, interactive 3D identity and new editorial content.

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

The opening uses the original chrome-and-orange mineral sculpture, restored from the preferred visual revision. One shared population unfolds into six distinct arrangements: mobility routes, a health signal, a systems framework, material cells, an event spectrum and a branching research form. Inspection follows actual geometric features. Reverse scrolling and interrupted choices begin at the displayed mixture. Pointer movement influences the sculpture without replacing ordinary navigation.

The signature sequence retains the preferred pacing: 8.4 viewport heights on desktop and 7.4 on phones. Six field choices and eighteen inspection perspectives connect the art to practical questions. Copy eases into a readable state when a visitor stops between forms. The portfolio returns to large venture rows and full-size illustrations, followed by the architectural company image and six illustrated industry guides. Filtering and search select a matching illustration, native scrolling follows the venture being read, and keyboard selection keeps its own preview. Empty results offer a reset.

Expanded detail stays inside dedicated pages: each venture has a distinct six-part worked example whose scenarios change positions, dependencies, uncertainty and next responsibility. These are explicitly synthetic editorial models, rather than operating products or customer records. Global search, the journal, design studies, inquiry context and structured editing remain available.

The research playground lets visitors morph the common fragment population into six arrangements, adjust structure and perspective, drag to turn, reset, copy a study URL and export the actual rendering as a PNG. A partnership brief builder changes its framing around a challenge, experiment or experience. Visitors can save or copy the outline and carry it into an editable contact inquiry without sending anything automatically. Search, focus explorers, disclosures and journal articles complete the portfolio.

The motion director is `src/scripts/matter.ts`, shared geometry is `matter-geometry.ts`, and the physically shaded renderer is `matter-renderer.ts`. Rendering stops when settled, hidden or outside the scene; smaller devices use fewer instances, and slow rendering reduces resolution. Pause, reduced motion, short landscape screens, no JavaScript and graphics failure retain original artwork and a natural reading layout. Static artwork is stored in `src/assets/matterfield`; Astro generates responsive WebP images. [Research and design targets](design/matterfield/brief.md) and [browser design review](design-qa.md) record the direction and its verification.

The investor page compares up to three venture directions, restores shared selections and exports a reading pack containing actual published scope and review questions. The research experiment planner supports 24 field/method combinations, editable questions and a reviewed Labs inquiry handoff. Its shared setup omits custom text.

Run `npm run test:depth` for the scroll journey, inspection dialogs, sector guides, comparisons and research outlines. Run `npm run test:enrichment` against the production preview for the constellation, nine venture scenarios, partnership handoff and deeper research controls. Both browser suites capture their reviewed states in ignored `artifacts/matterfield/` directories.

The deeper editorial pages use original chrome vector studies for six fields and nine distinct venture variants. Their fragments assemble reversibly as a section enters, respond gently to pointer/focus, and rest when settled, hidden or paused. SVG definitions share repeated geometry to keep the detailed artwork compact. Company, Approach and Partnerships connect illustrated reading lenses to concrete outputs and review criteria; Research and Investors include evidence lenses. Journal articles have native, keyboard-operable diagrams, a reading guide and practical examples. Venture focus explorers include preparation, proposed outputs and review questions, while industry guides add evidence exhibits and cross-field explanations. The fixed masthead gains an opaque surface when scrolled to keep long-form reading clear.

Run `npm run test:quality` for the illustrated reading lenses, native article diagrams, distinct portfolio artwork, graphics motion controls and new resource/navigation paths. The suite covers desktop, phone, narrow phone, reduced motion and no JavaScript against production output.

The expanded journal includes eight authored illustrations and primary references. Four dated website design studies connect artifacts, methods and limits; eighteen industry exhibits compare actual information states, with fifteen generated review documents and worksheets. Global search includes 42 public records with aliases and type filters. Inspected examples, studies, connections and comparisons can carry into a one-hour, tab-local inquiry draft. Personal questions stay out of navigation URLs and analytics. Storage denial retains copy and download alternatives.

Run `npm run test:experience`, `test:discovery-browser`, `test:studies`, `test:examples` and `test:editorial-browser` for these interactions. `test:editorial` and `test:discovery` validate data contracts; `python3 scripts/verify-public-output.py` checks the generated public document graph and cross-page anchors. That last audit uses Python 3.9+ and no external packages. CI builds and serves the actual Vercel output before its representative browser checks. See [discovery-and-inquiries.md](discovery-and-inquiries.md) for privacy and delivery behavior.

## Content and publishing

See [updating.md](updating.md) for editable sources, [cms-setup.md](cms-setup.md) for Sanity editing, and [inquiries.md](inquiries.md) for Resend delivery. Content describes venture directions and invites a conversation about current scope. It does not invent customers, launches, clinical outcomes, financial results or certifications. Confirmed stages and product URLs require approved content.

Established `/projects` and `/insights` routes remain intact. Canonicals, structured data, sitemap, article attribution and tailored social previews target `https://nrth.group`. Private previews and API routes are excluded from indexing. Search metadata supports discovery; ranking depends on content, external signals and indexing.

Code publishing uses the connected `21ar/nth-group-website` → `nrth1/nrth` workflow. Branches generate Vercel review previews; successful `main` deployments update production. CMS publishing can queue a rebuild through an authenticated webhook. Vercel deployments preserve HTML, resources and content revisions together for rollback. Keep credentials in environment settings, never in the repository.
