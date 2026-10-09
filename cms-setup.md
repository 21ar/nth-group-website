# NRTH editorial Studio

The website runs without Sanity using repository content. A configured project supplies published overrides; unavailable or invalid configured CMS requests fail a build, rather than silently publishing stale content.

## Connect a project

1. Create or select a Sanity project and dataset. Use a private dataset if non-public company material may be drafted there.
2. Add the website’s server/build variables: `SANITY_PROJECT_ID`, `SANITY_DATASET`, and a read-only `SANITY_API_READ_TOKEN`. Add a separate random `CMS_PREVIEW_SECRET` of at least 32 characters. Never prefix private values with `PUBLIC_` or `SANITY_STUDIO_`.
3. Copy `studio/.env.example` to `studio/.env.local` and set its project ID, dataset, and website preview URL. These three values are public configuration; no access tokens belong in the Studio bundle.
4. Install and run the editor:

```sh
cd studio
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev
```

The editor requires Sanity account authentication. Revision history and publish controls are provided by Sanity. Deploy the Studio separately through Sanity or another authenticated editor host.

## Initial drafts and previews

`node scripts/seed-cms.mjs` creates 19 initial draft documents from current venture, field, company, and journal content. Run it with project/dataset variables and a temporary write token through your local private environment. It uses create-if-missing operations and publishes nothing. Remove the write token afterward; website delivery and previews only need read access.

Use the Studio’s “Preview on website” action. Sign into `/preview` once with the private editor key. A signed, HTTP-only, time-limited cookie protects the draft routes and draft-state API. Home, Company, Investors, venture pages, and articles render through the same components as public pages. The browser checks draft revision changes every five seconds and reloads while keeping the scroll position. Preview routes use `noindex` and private/no-store responses. Preview keys and CMS read tokens are never passed in public query strings.

Venture names and the six field identities are fixed. Stage changes require a reviewed date; default scope is an overview with availability discussed directly. Milestones should describe an actual, sourced event. The internal milestone reviewer/source field is excluded from public queries. Covers require image descriptions. Established article URLs remain available from repository defaults.

## Publish

Create a Vercel deploy hook for the correct Git branch and put its URL in private `VERCEL_DEPLOY_HOOK_URL`. Set a separate `SANITY_WEBHOOK_SECRET`. Configure a Sanity webhook:

- URL: `https://nrth.group/api/publish`.
- Method: POST; custom header `x-nrth-publish-secret` contains the shared webhook secret.
- Filter: documents whose `_type` is `venture`, `industry`, `siteSettings`, `article`, or `milestone`, excluding IDs beginning `drafts.`.
- Trigger on published creation/update/deletion; exclude draft edits.

The endpoint confirms only that a deployment was queued. The public site changes after Vercel successfully builds the published snapshot. Review the preview before publishing to the production branch. Each build freezes one private content snapshot and publishes a revision manifest at `/resources/content-revision.json`; the PDF and HTML use that same snapshot. A previous immutable Vercel deployment restores matching code and public content. Rebuilding an old code commit fetches current CMS content, so use deployment rollback when restoring an exact published version.

## Verification status

Studio type checks and a production Studio build passed using a non-connected placeholder project ID solely to validate bundling. Editor account access, authenticated draft editing, webhook rebuilding, real private-dataset permissions, and a production content rollback require the actual account connection and remain operational checks. Do not treat a Studio build as a configured CMS.
