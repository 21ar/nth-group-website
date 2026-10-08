# NRTH hosting

The existing Vercel project is `nrth1/nrth`, connected to `21ar/nth-group-website`. The permanent production alias is https://nrth-nrth1.vercel.app; the canonical public website is https://nrth.group.

Normal, certificate-verified HTTPS reached nrth.group on October 8, 2026 with HTTP 200. The previous instruction saying the apex still required DNS correction is obsolete. This implementation does not change Cloudflare DNS or provision email mailboxes. Verify the www redirect separately through Vercel’s domain settings; an environment proxy rejection is not proof of a DNS failure.

The new build uses the official Astro Vercel adapter and Build Output API. It creates `.vercel/output/static` plus a Node server function for inquiries, image processing, and private editorial previews. `vercel.json` supplies install/build commands and private-preview/resource response headers. Remove any obsolete manual `dist` output-directory override in project settings if it prevents adapter output detection.

Branch pushes generate Vercel previews and successful main deployments update production. Account authentication is separate from a repository connection. During this implementation GitHub authentication worked, while the standalone Vercel CLI was logged out; the existing Git integration is the publishing route.

The email and CMS integrations need private configuration as described in [inquiries.md](inquiries.md) and [cms-setup.md](cms-setup.md). A website deployment does not create recipients or connect a Sanity project. Provider acceptance, actual inbox receipt, draft permissions, webhook publishing, and rollback should be checked with those accounts after configuration.
