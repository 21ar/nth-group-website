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

`node scripts/seed-cms.mjs` creates initial draft documents from the current nine ventures, six fields, company settings, and journal articles. It seeds structured venture scope and article diagram metadata alongside the writing, including stable keys for nested editor arrays. Run it with project/dataset variables and a temporary write token through your local private environment. It uses create-if-missing operations and publishes nothing; existing draft records are never overwritten. Remove the write token afterward; website delivery and previews only need read access.

Use the Studio’s “Preview on website” action. Sign into `/preview` once with the private editor key. A signed, HTTP-only, time-limited cookie protects the draft routes and draft-state API. Home, Company, Approach, Research, Investors, Partnerships, Press, all six industry guides, venture pages, and articles render through the same components as public pages. The workspace links to each draft surface. The browser checks draft revision changes every five seconds and reloads while keeping the scroll position. Preview routes use `noindex` and private/no-store responses. Preview keys and CMS read tokens are never passed in public query strings.

Venture names and the six field identities are fixed. Stage changes require a reviewed date; default scope is an overview with availability discussed directly. Milestones should describe an actual, sourced event. The internal milestone reviewer/source field is excluded from public queries. Covers require image descriptions. Established article URLs remain available from repository defaults.

## Structured editing

Venture, industry, article, and company-page documents now expose **Structured editorial detail**. These records render in the same public and private preview components, rather than being unused editor fields:

- Sections have stable IDs, headings, plain-text paragraphs, optional field artwork, and a caption. The first paragraph and deeper text remain ordinary accessible reading content.
- Worked examples separate their context, assumptions, walkthrough, output, and limits. Keep hypothetical values labelled as illustrative; a visual model is not evidence of a shipping capability. Venture model choices refer to one of the nine existing illustrated models.
- References explain why a source matters. Approved resource shelves include a description and format, and can point to existing site resources or an HTTPS resource.
- Relationships connect known ventures, fields, and journal URLs. Invalid identities are omitted instead of creating broken public links.
- Venture scope records describe the current public scope, availability, an optional reviewed date, and an approved public reviewer or team. Scope is separate from the confirmed development-stage field. A date alone does not establish a stage.
- Company facts feed the Company page directly. The company settings document also supports detailed sections and resources for Company, Approach, Research, Investors, Partnerships, and Press.

Articles retain their authored conceptual diagram when a paragraph is edited. To change the argument itself, edit the diagram's central idea, caption, three reading lenses, paragraph section boundaries, and continuation together. Paragraph boundaries use zero-based positions; the first starts at `0`, and every start must point to an existing paragraph. Invalid diagram overrides fall back to the established article's repository model. A new article without an authored model uses the neutral reading layout.

The website bounds every text field and array before rendering, validates real calendar dates, accepts credential-free HTTPS URLs, and restricts internal links to existing public route identities. Private preview and API routes cannot appear in editorial links. Download paths must belong to the approved resource registry in `src/data/editorial-content.ts`; register a newly created local file there when adding it. Text is escaped by Astro. The schema has no raw HTML or executable embed field.

Run `node scripts/verify-editorial.mjs` after changing this contract. Its checks cover link validation, canonical relationships, structured scope, diagram continuity after a writing edit, private draft separation, and one immutable public snapshot. Network calls in that suite are mocked.

## Publish

Create a Vercel deploy hook for the correct Git branch and put its URL in private `VERCEL_DEPLOY_HOOK_URL`. Set a separate `SANITY_WEBHOOK_SECRET`. Configure a Sanity webhook:

- URL: `https://nrth.group/api/publish`.
- Method: POST; custom header `x-nrth-publish-secret` contains the shared webhook secret.
- Filter: documents whose `_type` is `venture`, `industry`, `siteSettings`, `article`, or `milestone`, excluding IDs beginning `drafts.`.
- Trigger on published creation/update/deletion; exclude draft edits.

The endpoint confirms only that a deployment was queued. The public site changes after Vercel successfully builds the published snapshot. Review the preview before publishing to the production branch. Each build freezes one private content snapshot and publishes a revision manifest at `/resources/content-revision.json`; the PDF and HTML use that same snapshot. A previous immutable Vercel deployment restores matching code and public content. Rebuilding an old code commit fetches current CMS content, so use deployment rollback when restoring an exact published version.

## Verification status

The structured editor's type checks and validation tests run locally without a live account. A Studio build with a placeholder project ID validates bundling only. No Sanity or preview-service variable names were configured in the implementation shell when this change was reviewed. Editor account access, authenticated draft editing, webhook rebuilding, real private-dataset permissions, and a production content rollback require the actual account connection and remain operational checks. Do not treat a Studio build as a configured CMS.
