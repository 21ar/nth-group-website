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

- Astro check: 98 files, zero errors, warnings or hints. Website build: 32 public static pages and the Vercel handlers.
- Sanity Studio type check and bundle build passed with documented placeholder project settings.
- Geometry: 92 checks, including all directed form pairs, finite intermediate states, unique material-cell positions, easing endpoints and exact interruption starts.
- Services/content: 28 checks with mocked delivery; no email sent.
- Browser: **325 checks passed** against the actual production output. Includes shared geometry, reverse travel, interrupted choices, all six fields, pointer response, idle/offscreen suspension, focus trapping, directory search/filtering, all nine venture focus explorers, supporting-page metadata, investor routing, inquiry review/copy/download and failed-delivery preservation, and a nonblank exported research PNG.
- Responsive checks covered 1440×1000, 1440×700, 390×844, 360×640 and 320×568. Each of the six industry states was checked at the four smaller compositions. Touch used a separate mobile context; short landscape used 844×390.
- Pause, reduced motion, lost graphics context, unavailable WebGL and no JavaScript retained useful content and navigation.

The [browser result record](design/matterfield/qa/browser-results.json) accompanies the captures. Software WebGL was identified without driver masking. Physical-GPU frame rate and field performance on actual phones were not benchmarked. The renderer uses instancing, an adaptive resolution and a sleeping loop; its Three.js chunk is lazy-loaded (approximately 132KB gzip), and Vite reports its raw size above the default 500KB advisory threshold. Core copy is server-rendered and immediately available with artwork.

Live email delivery and editorial accounts require the owner's service configuration. Tests use controlled mocks and do not send an inquiry or publish CMS content. Code changes remain reviewable through the GitHub/Vercel preview workflow.

## Venture detail and useful interaction

The expanded portfolio retains the visual direction and adds four purposeful experiences. The [additional captures and browser record](design/matterfield/qa/enrichment/) show the constellation, scenario decisions, research controls and partnership outline on desktop and phones.

- The constellation has nine source perspectives, six industry shortcuts and 24 directional relationships. Selecting a venture traces its paths and explains the possible handoffs; hovering or focusing a relationship emphasizes its specific path. Spatial keyboard instructions accompany the controls, and native venture links plus all nine perspectives remain available without JavaScript.
- All nine venture pages now have specific audiences, three connected workflow stages, three context scenarios and three practical questions. The selected scenario changes the situation, task and next decision; its inquiry retains the venture and topic. Direct section navigation helps visitors reach the detail.
- The research playground has six arrangements, keyboard tabs, drag rotation, reset, stateful study URLs and actual PNG exports. Every arrangement exported a distinct, nonblank rendering. Shape changes use a 1.45-second quintic timeline from the displayed mixture, including interrupted choices; structure changes use 800ms. Settled rendering stops.
- The partnership builder changes its question around a challenge, experiment or experience. Its actual selected expertise and written context appear in a saved outline and an editable inquiry. The tab-local transfer clears after use; an expired transfer is rejected. Review selects the partnerships inbox without sending a test message.

**165 additional production-browser checks passed**, alongside the 325 regression checks, for **490 browser checks** in total. Independent screenshot review covered 1440×1000, 390×844 and 320×568 for the new experiences. No blocking layout or interaction findings remained. Native scenarios and questions remain readable without JavaScript; reduced motion retains direct control without animated transitions.

The review corrected unsupported SVG visibility attributes, clarified the constellation’s keyboard operation and slowed research morphs that advanced too far in a slow-rendering frame. These are functional interactions and illustrative venture contexts; the website does not assert production integrations or product availability.

## A deeper continuous journey

The opening now spans 8.4 viewport heights on desktop and 7.4 on phones. The same fragment population passes through six resting formations at .43, .508, .586, .664, .742 and .82. Native scrolling reverses those transitions; manual choices hold until the visitor advances and then return smoothly to the shared journey. Three orbital guides resolve into surface traces. The discovery cue begins with the first industry.

Eighteen inspection perspectives connect selected fragments to concrete questions, preparation details and relevant ventures. The native reading dialog supports keyboard tabs, close/Escape, focus return, scroll locking and phone layouts. Its selected surface traces are brighter, and its close control remains accessible while reading.

An industry directory and six detailed guides add eighteen decision contexts, fifty-four preparation questions, distinct diagrams, venture relationships, scope questions and adjacent fields. Investors can compare three ventures, share a selection and export a reading pack with actual published scope. Research adds twenty-four field/method outlines, editable questions, saved text, shared setups that omit custom text and a consumed-once Labs inquiry transfer.

The [new captures and result records](design/matterfield/qa/depth/) document desktop, 390px and 320px states. **155 depth checks**, **165 enrichment checks** and **325 regression checks** passed against the production preview: **645 site browser checks**. A separate focused industry pass completed **169 additional checks** on the production output, including diagram label collisions, exact selected paths, keyboard operation, no-JavaScript reading and stable summary position when switching context.

The review corrected early Mobility artwork overlap by reserving its art area before .42, strengthened inspection feedback, preserved the reader’s position when disclosure heights change, and aligned the discovery cue with the new journey. Eighteen pointer-position captures checked Mobility and its transition on desktop and phones. No blocking findings remained in reviewed states. Graphics failure and no JavaScript retain all nine venture links and all six industry guides.

Astro validation covers 98 files with zero errors, warnings or hints. The build produces 32 public static pages, social images and Vercel handlers. Geometry and mocked-service suites remain 92 and 28 checks. The existing software-graphics, physical-device and optional live-service limits still apply.

final result: passed


The complete original visual baseline has been restored from the owner-selected revision `a4529e3`. Current acceptance evidence is in [the restoration record](design/matterfield/restoration.md): 918 browser assertions, 180 geometry/service checks, 2,207 public-document checks, both builds and source checks pass. Fresh deployed-reference comparisons confirm the original page structures and rendered imagery, including supporting pages.
