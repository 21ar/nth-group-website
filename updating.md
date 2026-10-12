# Updating NRTH

## Immediate local feedback

Run `npm run dev` and save a source file. Changes appear through hot reload. Public production changes after a successful deployment.

| Edit | Source |
| --- | --- |
| Opening and investor introduction | `src/data/site-content.ts` |
| Venture summaries, stages, approved URLs | `src/data/projects.ts` |
| Six industry introductions | `src/data/industries.ts` |
| Detailed industry guides, contexts and diagrams | `src/data/industry-stories.ts`, `src/components/IndustryPage.astro`, `src/scripts/industry-stories.ts` |
| Eighteen opening-scene perspectives | `src/data/scene-perspectives.ts`, `src/components/StoryInspector.astro`, `src/scripts/story-inspector.ts` |
| Investor comparison and reading packs | `src/data/investor-perspectives.ts`, `src/components/InvestorCompare.astro`, `src/scripts/investor-compare.ts` |
| Experiment starter questions and methods | `src/data/experiment-directions.ts`, `src/components/ExperimentPlanner.astro`, `src/scripts/experiment-planner.ts` |
| Venture focus explorers | `src/data/project-details.ts` |
| Venture context, preparation, outputs and review criteria | `src/data/venture-perspectives.ts`, `src/styles/venture-quality.css` |
| Venture audiences, workflows, scenarios and questions | `src/data/venture-stories.ts`, `src/components/VentureStories.astro` |
| Portfolio relationship stories and constellation | `src/data/connections.ts`, `src/components/ConnectionsExplorer.astro`, `src/scripts/connections-explorer.ts` |
| Journal writing | `src/data/articles.ts` |
| Journal reading structure, cards and interactive diagrams | `src/data/journal-guides.ts`, `src/components/JournalCard.astro`, `src/components/JournalDiagram.astro` |
| Company, approach and partnership illustrated lenses | `src/data/editorial-models.ts`, `src/components/EditorialModel.astro`, `src/scripts/editorial-model.ts` |
| Research and investor evidence lenses | `src/data/decision-lenses.ts`, `src/components/DecisionLens.astro`, `src/scripts/decision-lens.ts` |
| Investor industry diligence | `src/data/investor-field-questions.ts` |
| Original six-field graphics and nine venture variants | `src/data/quality-graphics.ts`, `src/components/QualityPlate.astro`, `src/scripts/quality-plate.ts`, `src/styles/quality-plate.css` |
| Homepage / company / investors | `src/components/HomePage.astro`, `CompanyPage.astro`, `InvestorsPage.astro` |
| Shared venture / article layouts | `src/components/VenturePage.astro`, `ArticlePage.astro` |
| Colour, typography and responsive layout | `src/styles/matterfield.css` |
| Canonical NRTH logo | `src/data/brand.ts` |
| Shared fragment forms | `src/scripts/matter-geometry.ts` |
| Scroll narrative, field choices and timing | `src/scripts/matter.ts`, `src/components/MatterStory.astro` |
| Chrome material, lighting and camera | `src/scripts/matter-renderer.ts` |
| Research shapes, structure, perspective and image export | `src/scripts/matter-lab.ts`, `src/components/MatterLab.astro`, `src/styles/matter-lab.css` |
| Partnership outline and inquiry handoff | `src/components/PartnershipBrief.astro`, `src/scripts/partnership-brief.ts`, `src/styles/partnership-brief.css` |
| Original artwork / venture cover mapping | `src/assets/matterfield/`, `src/data/visuals.ts` |
| Delivery / editorial configuration | `.env.local` or private Vercel settings |

The geometry is generated directly from deterministic formulas. No baking step is required. Industry order in `industries.ts` follows Mobility, Health, Systems, Materials, Events and Research. Each label matches a form in `matter-geometry.ts`. Preserve the common fragment count across poses so a new selection can begin from the displayed geometry.

Review motion on a phone, a short desktop screen and a reduced-motion browser after changing form scale, camera position or copy. The mobile artwork occupies its own area above the text. Keep field descriptions and navigation clear of each other. Use `npm run test:browser` against a fresh production preview to check the complete experience.

The additional venture scenarios describe illustrative contexts, rather than shipping product features. Keep their distinction and practical decision clear when changing the writing. Relationship stories describe potential information handoffs; update the explanation together with the selected ventures. The partnership tool transfers a prepared outline through tab-local session storage to the contact form, then clears that transfer. It does not send a message or require a service account.

The opening journey reaches six resting formations at normalized scroll positions .43, .508, .586, .664, .742 and .82. It blends the same fragment population between them. Manual industry choices hold until the visitor advances the scroll, then rejoin the journey from the displayed pose. Opening height and inspection presentation live in `matter-story-depth.css` and `story-inspector.css`; keep the renderer’s field layout fully reserved before .42 so the first mobility view clears its text. Inspection changes the existing fragments' colour and surface traces, rather than adding a second shape.

The research planner supports 24 field/method combinations and 18 starter questions. Its share URL contains field, method and starter identifiers; custom question text stays out of the URL. Choosing Continue transfers the outline into the Labs inquiry through tab-local storage, clears the transfer after use and keeps the message editable. The investor comparison shares only selected venture slugs and exports current published scope with qualified reading questions.

Run `npm run test:depth` against a fresh production preview after editing these experiences. The existing browser and enrichment suites cover their surrounding flows. The industry directory and all six guides are linked from the homepage, opening inspector and footer.

The vector studies illustrate relationships rather than live product data. Keep their geometry, accessibility description and adjacent explanation aligned. Approved CMS venture covers still take precedence over repository illustrations. Journal diagrams and their section headings render only while their associated repository writing remains unchanged; CMS edits use a neutral article layout. The detailed reading lenses use native disclosures with position preservation so closing an earlier panel does not move the selected heading out of view. Use `npm run test:quality` after changing these controls, motion or graphics. Homepage, header, footer and contact refinements have separate `*-quality.css` files imported by their components.

## Visual content editing

Sanity Studio supports venture writing, confirmed stage and review date, approved covers, product URLs, industry copy, company facts, journal articles and milestones. Editors can use drafts, revision history and publish controls without changing source files. See [cms-setup.md](cms-setup.md).

Private website previews check drafts every five seconds and refresh while retaining scroll position. Published content is fetched at the next build. The editing infrastructure requires an actual project, dataset, read token, preview key and publish hook to operate with a live account. Repository defaults work without those settings.

## Review and publish

1. Edit and review the local experience.
2. Run the site check, geometry and service suites, production build and browser suite. Check and build Studio when its code changes.
3. Push a branch or open a pull request. The connected Vercel project generates a review deployment.
4. Merge a reviewed change to `main` to publish at nrth.group.

GitHub Actions checks the website, service behavior, geometry, Studio types and both builds. A failed deployment leaves the previous production version live. Vercel deployment history allows rollback with the matching pre-rendered content, resources and revision. Editing CMS content after deployment does not rewrite immutable public pages.
