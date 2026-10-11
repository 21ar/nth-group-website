# Matterfield design review

Direction: **NRTH — Build beyond.** Target: [new visual reference](design/matterfield/visual-target.png). Research, sources and measurable goals: [design brief](design/matterfield/brief.md). This is a new public frontend, visual system, artwork and editorial content. The supplied brand contours, canonical routes and neutral operational integrations are retained.

## Reference and implementation

The target's graphite surface, oversized lower-left typography, chrome mineral, warm reflections and quiet navigation are present in the implementation. The approximate generated wordmark is replaced by NRTH's actual four contours. The live mineral is original instanced geometry, with an irregular interlocking structure. Generated conceptual artwork supplies a detailed static alternative and the architectural/material editorial spreads.

DIA's official Squarespace motion studies informed a reusable visual unit with coherent behavior. Lusion and monopo informed the material, scale and local pointer response. These are translations of interaction principles; no third-party imagery or source code is shipped. Research limitations and award dates are recorded in the brief.

The same rounded fragments disperse and reorganize under native, reversible scrolling. Six industry choices produce routes, a care signal, a connected framework, tetrahedral cells, an event spectrum and a branching research structure. Rapid selection starts from the displayed pose. Text, camera and the dark-to-paper background follow the same progress. Plain links and on-entry editorial reveals carry the identity into supporting pages.

## Reviewed captures

| State | Capture |
| --- | --- |
| Desktop opening | [opening](design/matterfield/qa/opening.png) |
| Dispersed connection / intermediate morph | [connection](design/matterfield/qa/connection.png), [intermediate](design/matterfield/qa/intermediate.png) |
| Mobility / Health | [routes](design/matterfield/qa/field-mobility.png), [signal](design/matterfield/qa/field-health.png) |
| Systems / Materials | [framework](design/matterfield/qa/field-systems.png), [cells](design/matterfield/qa/field-materials.png) |
| Events / Research | [spectrum](design/matterfield/qa/field-events.png), [branches](design/matterfield/qa/field-research.png) |
| Transition toward the portfolio | [light surface](design/matterfield/qa/light-exit.png) |
| Phone opening / field selection | [opening](design/matterfield/qa/opening-390.png), [fields](design/matterfield/qa/fields-390.png) |
| 320px phone | [compact composition](design/matterfield/qa/fields-320.png) |
| Company / Investors / Directory | [company](design/matterfield/qa/about.png), [investors](design/matterfield/qa/investors.png), [directory](design/matterfield/qa/directory.png) |
| Venture page on a phone | [Telematics](design/matterfield/qa/projects-nrth-telematics-mobile.png) |
| Interactive research controls | [study](design/matterfield/qa/research-study.png) |
| Reduced motion / original static artwork | [static opening](design/matterfield/qa/reduced-motion.png) |

## Findings and corrections

| Priority | Finding | Resolution |
| --- | --- | --- |
| P1 | Chrome artwork crossed mobile copy and navigation. | Created a separate mobile artwork area, with responsive scale, position and field-copy spacing. |
| P1 | The smallest phone forced a third headline line into the controls. | Applied compact typography below 359px and checked all six selections at 320×568. |
| P1 | The contact heading overflowed narrower phones. | Made its scale follow available width; verified 320px, 360px and 390px pages. |
| P1 | Light-page navigation had insufficient contrast. | Applied blending to the complete fixed masthead; the open menu uses its own explicit dark surface. |
| P1 | Resource colours made the favicon too dark and the downloadable logo difficult to see on white. | Used the actual white contours on graphite for the icon, and ink contours for the transparent wordmark. Raster verification follows resource generation. |
| P2 | The mineral initially read as a regular radial star. | Varied interlocking directions, fragment sizes and outliers. |
| P2 | Uniform horizontal sampling left gaps on the care signal's steep sections. | Sampled the signal by arc length so its complete path remains continuous. |
| P2 | Framework edges had incomplete or separated segments at different instance counts. | Distributed fragments across complete connected edges, preserving the common population. |
| P2 | Dispersed fragments crowded the connection statement. | Directed that formation into the desktop artwork area and coordinated the mobile scale, position and headline. |
| P2 | Long contact invitations could clip their largest words. | Added a responsive long-word treatment and checked actual text bounds. |
| P2 | Static artwork showed a rectangular background on phones. | Composited it against the inherited scene background and preserved its own reading area. |
| P2 | Inactive controls remained visible without JavaScript. | Progressive enhancement reveals filtering, motion controls and focus choices only when their handlers are available. |
| P2 | A faded opening could still receive keyboard focus. | Made inactive narrative layers inert while retaining the static reading alternative. |
| P2 | Bright orange lost contrast on paper. | Used a deeper text accent on light pages, with continuous colour interpolation during the scene's background transition. |

No unresolved P0, P1 or P2 findings remain in these reviewed states. This conclusion concerns the implemented brief and captured browser states; it does not establish an award outcome.

## Verification

- Astro check: 69 files, zero errors, warnings or hints. Website build: 26 public static pages and the Vercel handlers.
- Sanity Studio type check and bundle build passed with documented placeholder project settings.
- Geometry: 92 checks, including all directed form pairs, finite intermediate states, unique material-cell positions, easing endpoints and exact interruption starts.
- Services/content: 28 checks with mocked delivery; no email sent.
- Browser: **325 checks passed** against the actual production output. Includes shared geometry, reverse travel, interrupted choices, all six fields, pointer response, idle/offscreen suspension, focus trapping, directory search/filtering, all nine venture focus explorers, supporting-page metadata, investor routing, inquiry review/copy/download and failed-delivery preservation, and a nonblank exported research PNG.
- Responsive checks covered 1440×1000, 1440×700, 390×844, 360×640 and 320×568. Each of the six industry states was checked at the four smaller compositions. Touch used a separate mobile context; short landscape used 844×390.
- Pause, reduced motion, lost graphics context, unavailable WebGL and no JavaScript retained useful content and navigation.

The [browser result record](design/matterfield/qa/browser-results.json) accompanies the captures. Software WebGL was identified without driver masking. Physical-GPU frame rate and field performance on actual phones were not benchmarked. The renderer uses instancing, an adaptive resolution and a sleeping loop; its Three.js chunk is lazy-loaded (approximately 132KB gzip), and Vite reports its raw size above the default 500KB advisory threshold. Core copy is server-rendered and immediately available with artwork.

Live email delivery and editorial accounts require the owner's service configuration. Tests use controlled mocks and do not send an inquiry or publish CMS content. Code changes remain reviewable through the GitHub/Vercel preview workflow.

final result: passed
