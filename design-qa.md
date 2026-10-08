# NRTH portfolio — design and implementation review

Review date: October 8, 2026. This records the current redesign. Earlier temporary previews, three-strand performance figures, and pending GitHub/DNS notes described previous releases and do not establish this build’s readiness.

## Visual result

The website now uses a single NRTH identity source: four contours traced from the supplied logo, including the open R. The header, footer, large opening, favicon, downloadable wordmarks, company PDF, and social graphics share those paths. These are traced contours rather than a claim to possess the original vector file.

The opening carries four persistent strands through letters, rings, infinity, and six industry symbols. Native scroll reverses the same geometry. Warm paper, ink, reflective silver, restrained amber details, Manrope display type, and Inter interface type carry through the portfolio and editorial pages. No green page surfaces or extra opening CTA remain. The six field controls and venture bullets reuse the ring-to-underline interaction.

Current chapter copy remains opaque at every resting position, while its heading settles gently. A shared mobile sculpture plane removes camera jumps caused by different chapter heights. Links wrap on short phones, including all four Mobility ventures. The header stays available, and menu focus is isolated and restored correctly.

Actual rendered screenshots reviewed include the desktop/mobile opening, intermediate logo and connection morphs, Mobility, Materials, the venture explorer, the TMS handoff, Telematics signal states, the form study, company/investor/press/research pages, and the company PDF. Evidence is saved under `artifacts/implementation` and `artifacts/brand-story`; those generated artifacts are ignored in Git.

## Meaningful exploration

Every venture has a distinct working concept, explicitly labeled as sample data. TMS validates routes and vehicle capacity; Health and Logistics explain handoffs; Telematics exposes signal age; Fleet filters records requiring review; Systems executes local rules; Chemicals provides application briefs; Events calculates an agenda; Labs lets visitors manipulate the shared geometry. These are showcase concepts rather than proof of live product capability or availability.

Company, Approach, Partnerships, Press, Research, Journal, Investors, Contact, and a Mobility ecosystem page support deeper exploration. Journal attribution, reviewed availability fields, approved company facts, related ventures, questions, downloadable resources, and page-specific metadata make the content more useful. Unknown stages say “Discuss availability.” No customer counts, certifications, financial results, clinical outcomes, or fundraising terms are fabricated.

## Performance and progressive graphics

The 3D scene uses environmental reflection, continuous tubes, baked contour data, and a bounded raster. Geometry and material costs were reduced after a software-graphics benchmark exposed stalls. Known software rasterizers select the same spline story through Canvas before the first animated paint. Unsupported WebGL and context loss also have a Canvas fallback. Pause and reduced motion provide a compact canonical SVG. The opening draws no additional frames without input, and rendering stops offscreen or hidden.

An isolated six-second forward/reverse run in the default cloud Chromium at 1440×900 measured **16.7 ms median and p95, zero frames over 100 ms, and no runtime exceptions**. The selected renderer was Canvas, and the opening made zero additional draw calls during the idle check. This meets the stated normal-browser frame targets. It does not establish hardware WebGL performance.

Forcing Chromium’s SwiftShader compositor measured approximately 33.4 ms median / 66.7 ms p95 with the selected Canvas path. Those artificial software-compositor limits remain recorded in `frame-timing-forced-software.json`. The 3D functional checks deliberately mask the driver label and exercise actual Three.js rendering in SwiftShader; their composition results demonstrate rendering behavior and clearance, not hardware speed. Hardware-device performance should be checked separately with real-user measurements.

The reflective scene remains a lazy homepage-only chunk, roughly 135 kB gzip plus 37 kB gzip of shared baked geometry. Vite reports its 500 kB uncompressed chunk warning; it is already dynamically imported and is not a blocking build failure. A static load score is separate from scroll performance.

## Operational scope

The built Vercel handler validates and routes inquiries, uses stable provider idempotency keys, and only confirms success after a provider receipt. The browser preserves failed messages and offers local alternatives. No-JavaScript visitors use the visible email addresses; the form stays hidden so an accidental GET cannot place inquiry text in a URL.

Sanity schemas, draft initialization, protected preview routes, five-second draft refresh, authenticated publishing, and immutable content snapshots are implemented. The Studio type check and bundle build passed with a placeholder project ID solely to verify code. Resend credentials, verified sending domain, recipient inboxes, and a real Sanity project were not available. Actual delivery, editor permissions, publish-webhook rebuilding, and account-backed rollback are therefore operational setup checks, not completed claims.

## Verification

- Astro diagnostics: zero errors, warnings, or hints; production build generates 26 public pages and the Vercel server handler.
- Service/content/session behavior: 28 checks using mocked delivery; no email sent.
- Geometry: 44 letter-to-ring topology checks and six distinct Materials contour pairs.
- Smoke: 45 browser checks.
- Motion: 65 checks covering forward/reverse travel, gallery transitions, touch, keyboard, pause, reduced motion, and no JavaScript.
- Composition: 114 intermediate states across six viewport sizes, including chapter overflow, copy/control clearance, sculpture clipping, and readable copy.
- Experience: 96 checks covering all nine concepts, resources, inquiry failures, private routes, mobile navigation, and graphics fallbacks.
- Final mobile Lighthouse lab run: 99 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 1.7 s, TBT 70 ms, CLS 0. Full-opacity scroll reveals and corrected concept heading levels resolved the audit findings. These scores describe this local production build and do not predict search placement.

The smoke/motion checks use normal cloud graphics; composition/experience explicitly exercise the 3D branch as described above. Hosted readiness is checked separately after publication. The saved cloud setup draft preserves the existing repository and network settings and updates the tested install/start workflow; it must be reviewed, saved, and published in environment settings to apply.
