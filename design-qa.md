# NRTH continuous brand story — final design QA

Final result: passed

Review date: September 30, 2026, America/Vancouver. This is an internal design and interaction assessment against the user's brief, not an external award judgment.

The original selected visual source (`/workspace/generated_images/exec-c84789f1-536f-45ee-8f89-b2e78688cd56.png`) and current production captures were inspected together in the same review input. Warm paper, large restrained typography, generous spacing and a minimal navigation remain. The user's newer instruction explicitly replaces the opening photographic infinity with N–R–T–H and a continuous industry story. The supplied NRTH identity remains in the header; the existing transparent logo derivative is documented in README rather than represented as an original vector export.

## Journey assessment

1. **Identity — strong.** `pose-0.png` shows large live N–R–T–H outlines below the opening copy with clear space between them. Static/reduced-motion identity uses the same canonical glyph paths. No photograph takes over or disappears on scroll.
2. **Transformation — strong.** Four strands persist through letters, rings, infinity, care, mobility, systems, materials, events, discovery and infinity. `half-morph.png` was visually checked alongside the original source and final poses. Correct winding and phase matching remove folded/pinched intermediate letters; 44 topology samples have no unintended self-intersections during letter-to-ring travel. Deliberate depth crossings in infinity and orbital symbols are part of their meaning.
3. **Industries — clear.** Six fields organize all nine ventures. Large concise headings, useful venture links, travelling connection points and ring-to-underline controls tie the sculpture to content. `pose-3.png`, other `pose-*.png` files and `final-mobile-mobility.png` show actual current-run states. Both native reverse scrolling and keyboard/touch navigation pass.
4. **Continuity below the opening — strong.** Gallery selection keeps its direction, moving marker, artwork and staggered copy; rapid switching leaves one active panel. Artwork carries into its detail view where native View Transitions are supported. Original platinum media (`editorial-art.png` and `editorial-art-mobile.png`) connects the editorial content to the ring language. Green-tinted section surfaces were replaced with neutral stone/paper.
5. **Responsive and motion control — passed.** All ten keyframes were measured at 390×844, 390×667, 768×844, 1024×844 and 1505×1045: 50 layouts, zero overflow or copy/shape/control collisions. Optional shape captions are omitted on short phones. Pausing late in the story returns to the compact readable identity. Reduced motion creates no animated canvas; no-JavaScript navigation reaches all nine ventures.
6. **Performance and accessibility — passed.** Expensive geometry construction is baked into a 46,080-byte quantized asset; visitors decode it rather than calculating SVG metrics or phase alignment. Rendering is bounded, stops offscreen/hidden, rests when the opening has no input, and adapts raster resolution/drawing rate under sustained slow frames without changing geometry. The final isolated four-second forward/reverse/pointer run measured median 16.7 ms, p95 33.4 ms, zero frames over 100 ms, and no browser errors. Earlier unbudgeted/cold runs were slower and drove the adaptive rendering changes; these lab numbers are not a guarantee for every device.
7. **Product completeness — passed for showcase scope.** All 21 static pages remain, including nine venture pages, directory/search, perspectives and contact preparation. Contact prepares a local email/copy/download; inbox provisioning and a hosted submission backend are not represented as complete.

## Resolved findings

- P1: opening image-to-live-geometry cut — removed; one renderer from the first interactive frame.
- P1: letter-to-ring folds — aligned contour winding before phase matching; verified intermediate contours and screenshots.
- P1: poor transition contrast/overlapping copy — foreground palette handling and coordinated fade intervals corrected; introductory aside leaves before the next chapter arrives.
- P2: opening typography collision and offscreen infinity — shorter deliberate line breaks and shape extent fitting.
- P2: pinched mobility/heart contours and depth-chunk seams — rounded contours, cubic spline drawing and continuous shadow/outline paths.
- P2: short-phone symbol/caption crowding — smaller adaptive composition and omitted optional caption.
- P2: excessive startup work and idle redraw — baked geometry, idle rest and bounded adaptive rendering.

No unresolved P0–P2 implementation findings remain within this brief. Exact original logo-vector fidelity, actual venture availability and legal/contact operational readiness remain launch-content considerations described in README.

## Verification evidence

- `npm run check`: 39 files, zero errors/warnings/hints.
- `npm run build`: 21 static pages; two client chunks, roughly 34 kB gzip combined.
- `npm run test:smoke`: 45 browser checks passed.
- `npm run test:motion`: 65 browser checks passed; zero console/runtime errors.
- `npm run test:geometry`: 44 intermediate contour checks passed.
- `artifacts/brand-story/layout-bounds.json`: 50 active layouts with zero reported collisions/overflow.
- `artifacts/brand-story/frame-timing.json`: final active-motion benchmark.
- `artifacts/brand-story/lighthouse-mobile.json`: 100 performance/accessibility/best practices/SEO; LCP 1.7 s, TBT 10 ms, CLS 0. These are local lab observations, not search-ranking guarantees.
- `motion-reference-notes.md` and `artifacts/brand-story/references`: fresh Lusion source inspection and DIA Coinbase/Base Onchain Summer case-study/animation inspection. DIA's own root was inaccessible; that limit is explicitly recorded.

Public readiness is checked after deployment with normal HTTPS certificate verification. Cloud Chromium public navigation is limited by proxy certificate trust; functional browser evidence is from the identical local production build.

## Published preview

https://temporary-brisk-emerald-98cbtu7.vercel.app — fresh temporary Vercel deployment, expiring September 30, 2026 at 10:19 PM PDT unless claimed. Normal HTTPS checks passed for all 20 regular pages and 125 referenced assets; a missing route returns HTTP 404. Evidence: `artifacts/brand-story/vercel-readiness.json`. The preview was queued for the current Codex browser panel; that UI action is not represented as hosted browser inspection.

## October 1 identity correction

Added the missing N to the canonical opening geometry and static fallback. All four strands remain continuous through the ten poses. Checked the desktop opening screenshot, 44 intermediate contour checks, and 65 motion checks on the rebuilt production site. The existing performance and full-layout benchmark figures above describe the previous three-strand review. The updated temporary preview is https://temporary-zippy-viola-spzwhih.vercel.app (expires October 1 at 2:29 AM PDT); all 20 pages and 125 assets passed normal HTTPS verification.

## October 1 outline and composition redesign

Rebuilt the opening glyph contours from the supplied logo proportions and signature R shape; these are hand-traced paths, not an original vector export. Removed shadow/understroke and duplicate highlight passes. Rebalanced the four-strand ring, infinity, route, frame, gathering and lens poses. Replaced the duplicated fourth Materials orbit with a small nucleus ring. Composition now fits projected geometry inside measured copy/control regions, including pointer rotation, rather than relying on viewport scale alone. Shape captions wait until the opening morph has moved into its reserved region. Current verification: 44 fold checks, six Materials silhouette-pair checks, 65 motion checks, and 114 composition checks with no copy/control collisions or clipping. Desktop and short/tall mobile opening and Materials captures were visually inspected.

The rebuilt client scripts total about 46 kB gzip. This replaces the earlier 34 kB three-strand bundle figure. Published revised contours and all 20 pages/125 assets passed HTTPS verification.

## Opening hierarchy adjustment

Removed the Explore NRTH opening CTA as requested and enlarged the opening wordmark to use almost the full viewport width. The scroll cue is the opening navigation cue and is visible on mobile, fading before industry controls appear. The larger opening and intermediate poses pass all 114 composition checks across six viewport sizes; all 45 smoke checks pass. The fallback venture link remains usable without JavaScript.

## Investor page

Added the Investors page and navigation/homepage entry points, an expandable portfolio overview with all nine ventures, investor questions, and a preselected contact flow. Checked five viewport widths, header collision bounds, mobile navigation, portfolio reveal visibility, and email preparation/routing: 39 checks passed. Astro check reports zero diagnostics; build produces 22 static pages. Desktop and mobile opening/portfolio captures were visually inspected.

## Permanent Vercel deployment

The latest site is deployed to the existing `nrth1/nrth` production project. Corrected an upload exclusion that previously omitted `src/scripts`; the remote build now passes. Normal HTTPS verification passed on the permanent deployment URL for 21 pages, 128 assets, and missing-route 404. The apex custom domain is assigned, and www redirects to the apex in Vercel. Cloudflare DNS changes remain pending; custom-domain HTTPS and the public www redirect have not yet been verified. See `hosting.md` for exact project-specific DNS requirements.

## Favicon and update workflow

Replaced the tiny padded raster tab icon with a tightly framed NRTH SVG wordmark on a dark tile, using the same canonical glyph contours as the opening. The versioned favicon link appears in shared page metadata. Centralized the homepage opening and investor copy, added an editing/publishing guide and GitHub build checks. Verified that saving a temporary copy change updates the development browser automatically, then restored the original copy. Astro check/build pass. GitHub/Vercel integration awaits the account Login Connection explicitly required by Vercel.
