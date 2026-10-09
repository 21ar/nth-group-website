# Direct inquiry delivery

The contact form prepares a browser-local review. “Send inquiry” posts to `/api/inquiries`; the server validates the payload, selects the correct destination, and uses Resend. A success response requires an email-service receipt and includes a stable reference. It confirms provider acceptance for delivery, rather than inbox receipt or a human response.

## Connect delivery

1. Provision the actual NRTH recipient mailboxes or aliases.
2. Verify a sending domain in Resend and create a restricted sending API key.
3. Add `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_EMAIL`, `PARTNERSHIPS_EMAIL`, and `INVESTORS_EMAIL` through private Vercel environment settings. Configure both preview and production as appropriate. Public fallback addresses should match the working destinations.
4. Deploy, then send controlled general, venture, partnership, and investor test inquiries and confirm receipt in their actual inboxes.

Suggested recipient addresses are `hello@nrth.group`, `partnerships@nrth.group`, and `investors@nrth.group`. Hosting the website does not create them. Sender example after domain verification: `NRTH Website <website@nrth.group>`.

Missing configuration returns 503; validation, origin, and spam failures return an accurate error; provider rejection or uncertain delivery returns 502. The message remains available for retry, copy, download, or sending with an email app. A repeated send of the same unchanged draft carries the same Resend idempotency key. Editing a draft creates a new request reference.

The endpoint bounds request bodies, rejects unknown topics and invalid fields, uses plain-text messages, includes a honeypot, and performs a best-effort per-instance rate check. Configure Vercel Firewall rate rules for `/api/inquiries` for deployment-wide protection; the memory check alone is not distributed protection. Request content and personal details are not sent to analytics.

`npm run test:services` tests acceptance, routing, idempotency, invalid input, unavailable configuration, provider rejection, and uncertain delivery using a mocked provider. These checks do not verify a real inbox. No email-service credentials were present during implementation, so actual receipt remains a configuration-dependent release check.
