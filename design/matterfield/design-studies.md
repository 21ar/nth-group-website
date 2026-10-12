# Documented work and industry examples

The `/work` library records four implemented website design studies. Every record identifies its date, subject, related venture perspectives, public artifact, method, support, limits and a practical review. The records concern creative interface work on this website. Their synthetic examples do not report customer deployments, user research, clinical effects, materials tests or produced-event outcomes.

The form study describes the restored mineral-and-fragment opening. The homepage retains large industry arrangements, semantic part inspection and the readable venture index with framed QualityPlate illustrations. Those illustrations share the chrome/copper material language but are separate authored SVG drawings, not a claim that the same 3D fragments continue into every portfolio artwork. The public form record links to both the opening and the venture index so that distinction can be inspected. The ribbon core, nine-icon atlas and cube-grid framework from the superseded homepage are not acceptance targets for this record.

## Source and editing

- `src/data/design-studies.ts`: the four public records, their routes and download metadata.
- `src/data/industry-exhibits.ts`: eighteen synthetic examples, with two explicitly different information states each.
- `src/components/StudyGraphic.astro`: four lightweight, original SVG compositions for continuity, information, conditions and rhythm.
- `src/components/EvidenceExhibit.astro`: native radio controls, corresponding diagrams and values, observations, optional tradeoff/review and scope.
- `src/components/WorkLibrary.astro`: subject filtering, four records and the reference download.
- `src/components/StudyPage.astro`: the complete readable study record, resources and selected-context inquiry.
- `src/components/ResearchPage.astro`: the research tools, documented library and optional structured editorial content. Its draft prop is used by private editorial preview.
- `src/components/IndustryPage.astro`: each context points to the relevant example. The three evidence exhibits stay beside preparation notes. CMS changes to the industry title/introduction and rich editorial fields are available in the private draft preview.

Keep records grounded in an inspectable artifact. An authored state is not an observation from a participant or a result from a technical test. If actual reviewed evidence is added later, identify its source, conditions, method and limitations rather than relabelling an illustrative record as proof.

Dates refer to creation/review of the design record, not to a product launch or a company milestone. The venture scope remains separate. A real product URL, a customer deployment or a clinical/material outcome needs its own approved information.

## Resources

`node scripts/build-study-resources.mjs` generates fifteen resources from the same data: four worksheets, four structured JSON records, six industry context worksheets and one study reference. It is also called by the main resource build.

The worksheets provide space for the visitor’s task, decision, conditions, observations, remaining unknowns and next owner. Downloading them does not collect or send information. Public JSON records explicitly identify their type as `illustrative-website-design-study` and include the canonical study URL.

When adding a new study slug or downloadable resource, update the approved registry in `src/data/editorial-content.ts` so CMS links can reference it. The work library, search index and social image generator derive current entries from the study data.

## Interaction and motion

Example controls are ordinary grouped radio inputs. CSS changes the selected state, so all examples remain interactive without JavaScript. Native disclosures expose the tradeoff and review. JavaScript adds a short optional state transition and carries the selected context into an editable inquiry. Nothing is submitted automatically.

The library filter is exposed only after enhancement. Every study remains directly linked without JavaScript. Artwork responds to pointer movement with a bounded transform and returns on pointer leave. Reduced motion and the site pause control disable that movement. There is no animation or WebGL rendering loop in the library or examples.

The study and selected example can continue into the shared prepared-inquiry flow. The handoff keeps only public selections in tab storage, uses the validated one-hour expiry and offers copy/download when storage is denied. The visitor reviews and edits the message before sending.

## Verification

`node scripts/verify-studies.cjs` verifies all four routes, subject filtering, eighteen two-state exhibits, scope/record contracts, fifteen resources, keyboard and native controls, selected-context inquiry, no-JavaScript fallback and 320px reflow. Use `NRTH_TEST_URL` for a built or remote preview and `CHROMIUM_PATH` for CI. This suite explicitly disables WebGL; it checks the native and SVG experience independently of the main scene.

The checks describe browser behaviour and authored content. They do not establish audience comprehension, physical-device frame pacing or real operating outcomes.
