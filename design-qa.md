# Living Fold design review

Reference: [selected Living Fold visual](design/living-fold-reference.png). Implementation: the Astro site on `feat/nrth-continuous-portfolio`. Reviewed in local Chromium against the actual Vercel build, with desktop, touch, reduced-motion, no-JavaScript and graphics-failure contexts.

## Design goals and observed behavior

- Large “Progress unfolds.” typography, ivory space, coral/lavender/ivory material, and the actual four-path NRTH mark. The source image’s approximate wordmark is replaced by the supplied brand geometry.
- One persistent canvas and three related sampled sheets. Native scrolling continuously unfolds the opening architecture into mobility routes; reverse scrolling restores the opening. Field selection transforms the same vertices, including when another selection interrupts it.
- Six meaningful field forms: mobility routes, an open embrace for Health, a rounded framework for Systems, cellular folds for Materials, a gathering space for Events, and an opening fan for Research. Text appears during the selection transition; hidden copy cannot take keyboard focus.
- Plain-word masthead and venture navigation. No numbered motion stages, decorative chapter captions, arrow CTAs or pill navigation in the showcase. All nine ventures are two actions from “Inside NRTH”.
- Matching original artwork across venture, company, investor and research spreads. The photo-like artwork provides static and reduced-motion alternatives; live geometry provides the controllable interaction. The live material adapts the reference rather than treating its composite image as a flat animated poster.
- A short signature sequence, followed by a normally scrolling portfolio and supporting content. The sequence is 285 viewport heights on desktop and 260 on mobile, rather than a compulsory six-field tour. Very short landscape viewports use a natural reading layout.
- The rendering loop sleeps when settled, offscreen or hidden. Known software graphics use the shaded Canvas path; slower WebGL frames reduce rendering resolution. There is no automatic looping video or forced scrolling.

## Browser captures

| State | Capture |
|---|---|
| Live opening / WebGL | [opening](design/qa/opening-webgl.png) |
| Mobility / WebGL | [mobility](design/qa/mobility-webgl.png) |
| Health / WebGL | [embrace](design/qa/health-webgl.png) |
| Opening / software fallback | [opening](design/qa/opening-surface.png) |
| Mobility / software fallback | [routes](design/qa/mobility-surface.png) |
| Mobile opening | [opening](design/qa/mobile-opening.png) |
| Mobile mobility | [mobility](design/qa/mobile-mobility.png) |
| Company | [company](design/qa/about.png) |
| Directory | [ventures](design/qa/projects.png) |
| Investors | [investors](design/qa/investors.png) |

## Findings and corrections

| Priority | Finding | Resolution |
|---|---|---|
| P1 | Existing header padding pushed the opening away from the reference. | Removed the inherited body offset; retained a fixed, readable masthead. |
| P1 | Software face sorting exposed cracks at intersecting sheets. | Rendered complete sampled contours with continuous material shading. |
| P1 | Rapid field changes could restart from an endpoint. | Each new morph starts from the exact displayed mixture of surfaces. |
| P1 | Short phones could clip the field navigation. | Added a compact composition; checked copy, links and controls at seven viewport sizes. |
| P2 | Closed surfaces could expose a seam or duplicate edge highlight. | Joined endpoint positions and normals; highlights follow only the two actual surface boundaries. |
| P2 | Floor shadows were too hard. | Reduced shadow opacity and used a wider filtered shadow kernel. Typography casts no shadows. |
| P2 | Company subnavigation inherited excessive section spacing. | Gave it its own compact padding and adjusted the following introduction. |
| P2 | Directory filters retained small type and an old pill outline. | Restyled filters and view controls as plain, readable words. |
| P2 | Field copy changed abruptly. | Added a short reveal coordinated with the longer surface transformation; disabled it for reduced motion. |
| P2 | A long Research heading reached the field controls on a shorter desktop screen. | Applied the same smaller type treatment used for long Materials headings. |

No unresolved P0, P1 or P2 findings remain in the reviewed states. Complete-page artifacts and machine-readable check results are generated in ignored `artifacts` directories.

## Validation

- Astro check: no errors, warnings or hints. Production website build passed; 26 static pages plus the Vercel handlers.
- Sanity Studio type check and build passed.
- Services/content: 28 checks, with mocked delivery and no email sent.
- Geometry: 70 Living Fold checks, plus the retained Labs study’s 44 topology and 6 silhouette checks. Includes solid thickness, finite intermediate geometry and joined closed seams.
- Responsive composition: 56 reviewed compositions at 360×640, 390×667, 390×844, 768×700, 1024×768, 1440×700 and 1440×1000.
- Motion: 55 browser checks covering intermediate geometry, reversibility, all fields, interrupted selections, idle/offscreen rendering, keyboard/touch operation and graphics fallbacks.
- Browser smoke: 45 checks covering portfolio navigation, directory filtering/search, inquiry preparation, downloads and canonical venture pages.
- Experience: 94 checks covering the WebGL path, all nine venture demos, investor routing, failed-delivery message preservation, private-preview access control and mobile supporting pages.

WebGL checks deliberately enable and identify Chromium’s software renderer as hardware to exercise that code path. They establish behavior and visual composition, not performance on physical GPUs. The normal software path is reviewed separately. Inbox provisioning and live mail delivery require the owner’s configured accounts; the site does not claim that a prepared or failed inquiry was delivered. Search metadata is implemented, but ranking and an award outcome are not guaranteed.

final result: passed
