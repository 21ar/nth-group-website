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

## Detail and graphic quality across the portfolio

The homepage now leads into a searchable nine-venture portfolio with distinct artwork for each venture. Its company section explains what stays specific and what knowledge can travel. The research spread introduces the actual studies and outline tool, the journal has illustrated reading cards, and investor links lead to comparison, reference material and a focused inquiry.

Six original chrome vector forms support nine genuinely different venture variants. Curved routes, interwoven information, architectural boundaries, material cells, a folded spectrum and branching research share a coherent material language. Their components assemble reversibly with native scrolling, respond gently to pointer or linked-card focus and stop when settled, hidden, paused or offscreen. Repeated paths are defined once per graphic and reused for material layers. The production homepage is 581,201 bytes of HTML, or 120,940 bytes using gzip; no extra WebGL context is introduced for these illustrations. The existing 3D material has softer reflections and more legible shaded faces.

Every venture adds its own practical question, relevant audience, preparation notes, proposed outputs, review questions and relationship explanations. Six industry guides add evidence exhibits and cross-field reasoning. Company, Approach and Partnerships use original illustrated reading models; Research and Investors connect four evidence lenses to concrete records and next decisions. Three articles have deeper examples, reading navigation and distinct native-radio diagrams that work without JavaScript. Press preserves the original four letter contours in filled and outline specimens, with scalable assets and a downloadable company reference. Contact adds useful preparation and conversation-specific reading paths. Footer links keep those paths accessible.

| Review finding | Correction and evidence |
| --- | --- |
| Transparent fixed navigation covered reading content. | An opaque graphite surface appears after scrolling; checked on desktop and both phone widths. |
| Closing an earlier disclosure moved the chosen heading offscreen. | Enhanced native disclosures preserve the selected summary within 2px and keep keyboard focus. |
| New portfolio graphics inherited a tall photograph container; industry art was too small. | Matched the sticky composition to the SVG and gave industry illustrations a generous, full-width space. |
| Detailed chrome layers repeated long path geometry. | Shared SVG definitions preserve the rendering with less markup; IDs and references remain unique and valid. |

The [current screenshots and result records](design/matterfield/qa/quality/) cover the opening, portfolio, company/approach models, research/investor evidence, journal and phone contact. The fresh production output passed **325 browser**, **165 enrichment**, **155 depth** and **358 quality** checks, totaling **1,003 maintained browser assertions**. The focused industry pass completed another **169 checks**, for **1,172 browser checks**. Geometry and mocked-service validation passed **92** and **28** checks respectively. Astro checked **113 files** with zero errors, warnings or hints; the build produced **32 public static pages**, canonical resources, social images and Vercel handlers. No email was sent during verification.

Reviewed states included 1440px desktop, 390px phone and 320px narrow phone, keyboard navigation, no JavaScript, reduced motion, global pause, actual exports and offscreen/idle rest. The prior physical-device and optional live-service limitations remain. No blocking design or interaction findings remained in the reviewed states.

final result: passed

## Prior connected-story overhaul (superseded visual direction)

The next-stage revision adds a joined ribbon surface, geometry-based inspection, a shorter native-scroll sequence, the nine-form atlas, a converging framework, nine semantic worked examples, eighteen industry exhibits, eight illustrated articles and four documented design studies. Global public search and one-hour inquiry context connect discovery to an editable introduction. Structured CMS content preserves diagrams when prose changes and separates public snapshots from private draft reads.

The fresh visual review identified hard fragment seams, dim stopped transitions, an atlas/title collision, remote phone inspection feedback and small timeline labels. The implemented refinements use joined surfaces, clear idle copy, shared atlas silhouettes, stable phone hit regions, nearby selected-part descriptions and 15px responsive legends. The still poster comes from the actual ribbon renderer. Captures made before those refinements are explicitly marked in the independent audit; they are not final release proof.

Final local validation passed 1,775 maintained browser assertions: 325 regression, 165 enrichment, 158 depth, 358 graphic/editorial quality, 316 integrated experience, 36 search/context, 228 studies/exhibits, 38 interrupted example motion and 151 expanded editorial checks. Geometry/data/service contracts passed 319 checks (236 geometry, 28 mocked services, 35 structured editorial and 20 discovery). Astro checked 165 files with zero errors, warnings or hints. The production build generates 42 normal public pages plus 404, 43 social images, fifteen study resources and the Vercel handlers. The generated document audit passed 6,080 checks, including cross-page fragments and assets. No email was sent.

The homepage HTML is approximately 59KB compressed, compared with approximately 121KB in the preceding revision. Three.js remains a lazily imported approximately 134KB compressed chunk with Vite’s standard large-chunk advisory. These byte counts are build evidence, not real-user Core Web Vitals or physical-GPU benchmarks. Live CMS/Resend accounts were not configured in this execution environment. Current results and screenshots are under ignored artifacts/next-stage, artifacts/next-stage-audit, artifacts/studies, artifacts/editorial-review and the maintained regression directories. The implementation record is design/matterfield/next-stage-implementation.md.


## Refinement of the preferred version

The visual baseline is again `267131c`: the original mineral opening, its six forms, large portfolio illustrations and architectural company image. The newer icon atlas, ribbon surface, modular framework and standalone homepage transportation model have been removed from the public homepage. Expanded venture/industry examples, search, journal articles, studies, inquiry preparation and structured editorial tools remain in their dedicated reading paths.

The acceptance targets are preservation of that visual identity, continuous reversible motion, readable stopped captions, geometry-based inspection, filtered previews that agree with the results, artwork that follows native reading, keyboard selection priority, recoverable empty searches and usable narrow-phone/native alternatives. Current verification evidence is recorded with the final test run rather than inherited from the superseded overhaul.


The restored version passed 1,463 browser assertions: 325 general regression, 170 continuous-story/inspection, 339 integrated experience, 364 graphic/editorial quality, 37 discovery/context and 228 studies/exhibits. Geometry passed 152 checks; discovery, mocked service and structured editorial contracts passed 83 more. Astro checked 165 files with no errors, warnings or hints. The production build and 6,882 public-document checks passed across 42 normal pages. Fresh accepted captures are in ignored `artifacts/preferred-refinement` and the maintained regression directories.

The motion review caught an outgoing layer intercepting a caption and fractional transform residues after reported settlement. Outgoing layers now ignore pointer events, and settled captions reach exact resting values. Tests verify actual hit targets during a transition, full opacity and zero vertical translation after settlement, ordinary inspector clicks and focus restoration. The fallback poster has a shallow protected header region; its size is unchanged. No real inquiry was sent.
