# Updating NRTH

## Immediate local feedback

Run `npm run dev` and save a source file. Changes appear through hot reload. Public production changes after a successful deployment.

| Edit | Source |
| --- | --- |
| Opening and investor introduction | `src/data/site-content.ts` |
| Venture summaries, stages, approved URLs | `src/data/projects.ts` |
| Six industry introductions | `src/data/industries.ts` |
| Venture focus explorers | `src/data/project-details.ts` |
| Journal writing | `src/data/articles.ts` |
| Homepage / company / investors | `src/components/HomePage.astro`, `CompanyPage.astro`, `InvestorsPage.astro` |
| Shared venture / article layouts | `src/components/VenturePage.astro`, `ArticlePage.astro` |
| Colour, typography and responsive layout | `src/styles/matterfield.css` |
| Canonical NRTH logo | `src/data/brand.ts` |
| Shared fragment forms | `src/scripts/matter-geometry.ts` |
| Scroll narrative, field choices and timing | `src/scripts/matter.ts`, `src/components/MatterStory.astro` |
| Chrome material, lighting and camera | `src/scripts/matter-renderer.ts` |
| Structure / perspective study and image export | `src/scripts/matter-lab.ts`, `src/components/MatterLab.astro` |
| Original artwork / venture cover mapping | `src/assets/matterfield/`, `src/data/visuals.ts` |
| Delivery / editorial configuration | `.env.local` or private Vercel settings |

The geometry is generated directly from deterministic formulas. No baking step is required. Industry order in `industries.ts` follows Mobility, Health, Systems, Materials, Events and Research. Each label matches a form in `matter-geometry.ts`. Preserve the common fragment count across poses so a new selection can begin from the displayed geometry.

Review motion on a phone, a short desktop screen and a reduced-motion browser after changing form scale, camera position or copy. The mobile artwork occupies its own area above the text. Keep field descriptions and navigation clear of each other. Use `npm run test:browser` against a fresh production preview to check the complete experience.

## Visual content editing

Sanity Studio supports venture writing, confirmed stage and review date, approved covers, product URLs, industry copy, company facts, journal articles and milestones. Editors can use drafts, revision history and publish controls without changing source files. See [cms-setup.md](cms-setup.md).

Private website previews check drafts every five seconds and refresh while retaining scroll position. Published content is fetched at the next build. The editing infrastructure requires an actual project, dataset, read token, preview key and publish hook to operate with a live account. Repository defaults work without those settings.

## Review and publish

1. Edit and review the local experience.
2. Run the site check, geometry and service suites, production build and browser suite. Check and build Studio when its code changes.
3. Push a branch or open a pull request. The connected Vercel project generates a review deployment.
4. Merge a reviewed change to `main` to publish at nrth.group.

GitHub Actions checks the website, service behavior, geometry, Studio types and both builds. A failed deployment leaves the previous production version live. Vercel deployment history allows rollback with the matching pre-rendered content, resources and revision. Editing CMS content after deployment does not rewrite immutable public pages.
