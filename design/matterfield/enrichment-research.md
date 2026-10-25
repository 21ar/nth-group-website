# Enrich the approved NRTH experience

Research checked on October 12, 2026. The owner’s selected `a4529e3` experience remains the visual baseline: cinematic chrome imagery, graphite and warm white, restrained orange, oversized type and generous space. The aim is to make its existing pages more useful and distinctive while retaining that character.

## Sources and evidence

| Reference | What was verified | Relevant lesson |
|---|---|---|
| [DIA / Squarespace](https://www.dia.studio/work/squarespace) | Official page freshly retrieved. Previously downloaded official kinetic and scroll films were re-inspected as contact sheets: a square rotates in perspective, tessellates and separates into several units; larger compositions are re-framed while scrolling. These are examples of the brand system, rather than a claim that the current DIA page implements each behavior live. | Develop several behaviors from one material and shape vocabulary. Camera framing, scale and grouping can explain a change in perspective without replacing the visual identity. |
| [DIA / Coinbase Onchain Summer](https://www.dia.studio/work/coinbase-onchain-summer) | Official case page and its **Chain System 01** film freshly retrieved. Sampled frames show repeated circles forming chains, distorted letterforms and differently scaled fields. DIA’s accompanying copy describes a generative system referencing links and the Base logo, applied across modular layouts and motion toolkits. | Give each venture its own subject, while chrome fragments, light and spacing make the family recognizable. Repeated elements should become something meaningful, not simply float behind a heading. |
| [Lusion](https://lusion.co/) / [Lusion v3 award](https://www.awwwards.com/sites/lusion-v3) | Current official page retrieved, including its featured projects and descriptions. The award listing identifies SOTD October 2, 2023. Earlier captured entry states are available in the original research directory; the complete current WebGL experience was not re-audited during this pass. | One physical material can create a memorable introduction; straightforward project writing and a readable shell make the experience useful beyond that introduction. |
| [Lando Norris / OFF+BRAND](https://landonorris.com/) / [award](https://www.awwwards.com/sites/lando-norris) | Official site freshly rendered at 1440 × 1000 with WebGL deliberately disabled. Native scrolling revealed a large signature, an airy photographic composition at approximately 5,000px, and a full-bleed portrait at approximately 7,500px. No page exceptions or failed resources were observed in these captures. Its 3D entry was not inspected. Award listing identifies SOTD November 17, 2025. | Richness can come from changing image scale, asymmetrical placement and spacious pacing. A page can alternate intimate context and a cinematic spread without a grid of small cards. |
| [Igloo Inc.](https://www.igloo.inc/) / [award](https://www.awwwards.com/sites/igloo-inc) | Official document and award page freshly retrieved. Award confirms SOTD July 23, 2024, credited to abeto and Bureaux. The current graphics-dependent scene was not rendered in this pass; previous research captures had an empty viewport. | Its material-led award presentation supports pursuing precise lighting and texture. It does not establish that NRTH should copy any particular live interaction. |
| [KPR](https://kprverse.com/) / [award](https://www.awwwards.com/sites/kpr) | Official document and no-WebGL entry captured. The shell exposes Story, Journal, Media and Gallery, but the entry remained at “Loading - 0%”; a Google account resource returned 403. Award confirms SOTD December 26, 2022, credited to Resn, and lists a “Click and Hold” interaction example. The complete scene and that interaction were not verified live. | Offer several ways into the material and a recognisable world. NRTH’s useful content should stay reachable before any graphics load. |
| [Opal Tadpole award](https://www.awwwards.com/sites/opal-tadpole) / [official product link](https://www.opalcamera.com/opal-tadpole) | Award page confirms SOTD January 11, 2024 and links to the official product page. The official destination returned a proxy tunnel 403; its live animation was not observed. | A potentially useful future reference for product storytelling, but no unverified animation is included in this implementation brief. |

Fresh HTML, capture metadata and stills are under `/tmp/nrth-enrichment-research`. Original official DIA film samples remain under `/workspace/nrth-reset/research`. Reference assets are inspection material and must not ship as NRTH imagery.

## Concrete additions

1. **Keep the opening and home composition.** Preserve the current fragment scene, three original home images, typography and section spacing. Add a selective venture feature with one generous image and a short, useful explanation. Existing venture and industry links remain the main discovery paths.
2. **Make the nine pages distinct.** Each already has a dedicated page. Add a venture-specific image, people and contexts, concrete areas of exploration, a richer scenario and questions that a visitor can bring to a conversation. Keep subject-specific details in readable sections and disclosures rather than presenting nine similar dashboards.
3. **Give Health a complete care-context story.** Cover preparing for an appointment, coordinating a handoff and understanding what happens next. Offer perspectives for the person receiving care, the care team and the people coordinating work. Explain information access, privacy, accessibility and clinical boundaries in the relevant context. Use illustrative content and never collect health records in a showcase interaction.
4. **Make interactions reveal information.** A context choice should change the explanation, question and relevant emphasis in its visual. Existing scenario controls can lead into a deeper example. Hover and focus can expose a local detail; touch must provide the same action. Use labelled controls and visible selected states, without decorative arrow buttons.
5. **Create a shared motion language.** A large image can slowly re-frame as its nearby story enters, with a small scale range and reversible native scroll progress. Context changes can smoothly adjust image emphasis or move one accent through a coherent sculpture. Avoid simultaneous movement across every paragraph. Preserve the readable static composition when motion is reduced, paused or unavailable.

## Original imagery directions

These are conceptual visual metaphors, not photographs of NRTH facilities or proof of available products. Keep soft studio lighting, physically plausible materials, deep shadows with readable silver edges, and one restrained orange reflection. Do not generate logos or fake interface text inside the images.

| Venture | Subject for a large new detail image | Connection to its story |
|---|---|---|
| Health | Rounded chrome forms surrounding an open, softly lit passage; frosted glass offers a quieter second material. | Information moving between people without losing its context; privacy and a clear next step. |
| TMS | Three polished paths meeting at a graphite junction, with one deliberate orange lane. | Requirements, resources and timing meeting in a transportation decision. |
| Telematics | A restrained silver probe within a spatial field; one narrow luminous trace moves toward a receiver. | A signal becomes useful when its freshness and operating context are understood. |
| Logistics | Calibrated blocks forming a clear bridge, with a single visible transfer point. | Ownership and expectations staying clear through a handoff. |
| Systems | Layered graphite architecture with connected silver apertures and one warm interior. | Boundaries, interfaces and responsibility giving complex work structure. |
| Labs | An open chrome lattice revealing a small unfinished area against dark stone. | A focused experiment exposing an uncertainty rather than implying a final answer. |
| Chemicals | Crystalline silver forms adjacent to a controlled glass/liquid interface. | Properties and application conditions matter at a material level. Avoid labels that imply a substance or safety claim. |
| Fleet | Several rounded silver volumes in a measured arrangement, one ready position intentionally open. | Readiness and available resources before assignment. |
| Events | Broad chrome ribbons framing an illuminated shared centre, with an expansive rather than crowded composition. | Arrival, rhythm and the purpose of gathering. |

## Review targets

- Every addition should look like part of the selected website in a full-page desktop and phone capture.
- New artwork should be subject-specific at thumbnail scale and remain legible at its large display size.
- Every context selection must reveal meaningful, venture-specific information and work by keyboard and touch.
- Inactive transition layers must not obscure links or controls; fast scrolling and interrupted selections must settle cleanly.
- Respect reduced motion and the existing pause control; useful text and images remain available without JavaScript or WebGL.
- Serve responsive, compressed images, reserve their layout space and lazy-load everything below the introduction.
- Keep status, evidence and availability clear; no invented customers, results, certifications, facility photographs or launch claims.
