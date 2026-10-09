# Updating NRTH

## Immediate local feedback

Run `npm run dev` and save a source file. Changes appear in the browser through hot reload. The production site changes after a successful deployment, rather than on every keystroke.

| Edit | Source |
| --- | --- |
| Opening and investor introduction | `src/data/site-content.ts` |
| Venture summaries, stages, URLs | `src/data/projects.ts` |
| Industry story | `src/data/industries.ts` |
| Audience, capabilities, workflow | `src/data/project-details.ts` |
| Scenarios and tailored FAQs | `src/data/project-scenarios.ts` |
| Journal | `src/data/articles.ts` |
| Concept demonstrations | `src/data/demos.ts`, `src/components/VentureDemo.astro`, `src/scripts/demos.ts` |
| Homepage / company / investors | `src/components/HomePage.astro`, `CompanyPage.astro`, `InvestorsPage.astro` |
| Shared venture / article layouts | `src/components/VenturePage.astro`, `ArticlePage.astro` |
| Design system | `src/styles/experience.css`, `demos.css`, `global.css` |
| Canonical identity | `src/data/brand.ts` |
| Living Fold shapes and scroll | `src/scripts/fold-geometry.ts` and `src/scripts/fold.ts` |
| Fold palette, scale and page layouts | `src/styles/living.css` |
| Original field artwork | `src/assets/fold-*.png`; Astro produces responsive WebP |
| Labs four-strand study | `src/data/geometry-source.ts`; run `npm run bake:geometry` |
| Delivery / editing settings | `.env.local` or private Vercel environment settings |

## Visual content editing

The separate Sanity Studio supports venture copy, stage and review date, approved covers, product URLs, industry copy, company facts, articles, and milestones. Editors can use drafts, revision history, and publish controls without modifying source files. See [cms-setup.md](cms-setup.md) to connect an account.

Private website previews check drafts every five seconds and refresh the rendered page while retaining scroll position. Published content is fetched during the next build. The Studio and integrations are implemented; editing is not operational until a real project, dataset, read token, preview key, and publish hook are configured.

## Review and publish

1. Make an edit and validate the local experience.
2. Push a branch or open a pull request. The GitHub-connected Vercel project generates a review preview.
3. Merge a reviewed change to `main` to publish it at nrth.group and https://nrth-nrth1.vercel.app.

GitHub Actions checks the site, service behavior, geometry, Studio types, and both builds. A failed Vercel build leaves the previous deployment live. Restore an earlier deployment through Vercel’s deployment history; its pre-rendered content, resources, and content revision remain together. Editing the CMS after deployment does not rewrite those immutable public pages.
