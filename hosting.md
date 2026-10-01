# Permanent hosting: nrth.group

## Deployment completed

- Vercel team/project: `nrth1/nrth`.
- Deployment: `dpl_HELALUtKXdPruZUH2qskhrBGMBZW` (production, READY).
- Public deployment URL: https://nrth-rgr8ebkbv-nrth1.vercel.app
- Intended canonical URL: https://nrth.group
- `www.nrth.group` is attached and configured to redirect to `nrth.group` with HTTP 308.
- Remote build passed. The upload ignore pattern is now `/scripts/` so it excludes root authoring scripts while retaining `src/scripts/` browser code. Local environment/auth files are explicitly excluded from uploads.
- All 21 regular pages and 128 referenced assets pass normal HTTPS verification. A missing route returns HTTP 404. Evidence: `artifacts/brand-story/vercel-readiness.json`.

## Pending Cloudflare DNS change

Cloudflare is authoritative (`grannbo.ns.cloudflare.com`, `drew.ns.cloudflare.com`). The apex still resolves to Cloudflare proxy addresses and `www` has no record. Vercel's domain config API reports both as misconfigured. No Cloudflare connector or credentials are available in this session.

Vercel's exact project-specific recommended records, checked October 1, 2026:

| Type | Name | Value | Proxy |
| --- | --- | --- | --- |
| A | @ | 216.198.79.1 | DNS only |
| A | @ | 64.29.17.1 | DNS only |
| CNAME | www | 13f26e8b5205baac.vercel-dns-017.com | DNS only |

Replace conflicting website A/AAAA records at the apex and conflicting www records. Preserve email/MX, email-related TXT records, and unrelated DNS entries. After applying the records, verify Vercel's domain configuration, HTTPS on the apex, www's redirect, page/assets, sitemap and canonical metadata.

Contact mailboxes are separate services. Deploying the website does not provision `hello@`, `partnerships@`, or `investors@nrth.group`.

The favicon/live-edit update was deployed successfully. Astro is now the project framework preset with explicit build/install/output commands, aligned with vercel.json. Latest HTTPS checks pass for 21 pages and 127 hashed assets, plus the separate NRTH favicon SVG. GitHub source and successful CI run: https://github.com/21ar/nth-group-website/actions/runs/36843692722. GitHub sign-in is connected. Vercel Git connection remains pending the Vercel GitHub app installation with repository access; see updating.md.
