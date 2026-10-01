# Updating the NRTH website

## Live editing

Run `npm ci` once, then `npm run dev`. Open the URL printed in the terminal. Saving a source file updates the local browser immediately, including styling and content changes. `npm run preview` serves a built copy; use `dev` for live editing.

Common edits:

| Change | File |
| --- | --- |
| Opening headline and homepage investor section | `src/data/site-content.ts` |
| Ventures, descriptions, focus areas | `src/data/projects.ts` |
| Industry descriptions and groupings | `src/data/industries.ts` |
| Venture page details and scenarios | `src/data/project-details.ts`, `src/data/project-scenarios.ts` |
| Investors page | `src/pages/investors.astro` |
| Shared navigation and footer | `src/components/Header.astro`, `src/components/Footer.astro` |
| Layout, spacing, colors | `src/styles/global.css` |
| Browser tab icon | `public/favicon.svg` and its version in `src/layouts/Layout.astro` |
| Logo animation geometry | `src/data/geometry-source.ts`; run `npm run bake:geometry` after editing |
| Contact addresses | `.env.local`, using the variable names in `.env.example` |

## GitHub and Vercel

The source repository is https://github.com/21ar/nth-group-website. The permanent Vercel project is `nrth1/nrth`.

Intended workflow:

1. Make changes locally or with Codex. Use the development server for instant feedback.
2. Push a branch or open a pull request for a Vercel preview link once the repository connection is enabled. Review it before publishing.
3. Merge into `main` to deploy automatically to the production domains. Production changes become visible after Vercel finishes its build, rather than on every keystroke.

GitHub Actions runs type/template checks and a production build on main pushes and pull requests. Vercel builds must succeed before a deployment becomes live; the previous deployment remains available if a new build fails. Preview builds don't publish to the production domain. Existing live versions can be restored from Vercel's deployment history.

**Connection status:** Vercel requires a GitHub Login Connection for account `21ar`. The CLI connection attempt returned this requirement; the Git repository integration is not enabled yet. Connect GitHub under https://vercel.com/account/settings/authentication, then run `vercel git connect https://github.com/21ar/nth-group-website.git --yes --project nrth --scope nrth1`. This file should be updated once the integration is verified.

Until then, a signed-in collaborator can publish with `vercel deploy --prod --yes --scope nrth1` from the linked project directory. The current production build configuration is in `vercel.json`.

Never commit `.env.local`, access tokens, or `.vercel` account/project state. The ignore rules exclude those files.
