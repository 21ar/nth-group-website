# Public discovery and prepared inquiries

The public search index is generated from the same published content getters as the site. `/search-index.json` includes nine ventures, six fields, published journal writing, documented design studies, public company pages and a small explicit resource shelf. Private previews, draft documents, API routes, inquiry data and error pages never enter the index. Add a new approved public resource to `src/data/search.ts`; articles and work studies appear from their respective data sources.

Search runs in the visitor’s browser. It normalizes case, accents and punctuation, matches every query word and ranks titles and aliases above descriptive copy. Type filters change the results rather than just their labels. The header’s Search link opens a native dialog when supported; Escape closes it and restores focus. Ctrl/Cmd-K also opens it. The `/search` directory and its actual links remain available without JavaScript or when loading the index fails. Search text is not sent to analytics or placed into the page URL.

## Carry a useful starting point

`src/scripts/prepared-inquiry.ts` exports:

```ts
prepareInquiry({
  project: 'nrth-tms',
  items: [{kind: 'scenario', label: 'Illustrative scenario', value: 'A shipment window changes.'}],
  draftMessage: 'An optional visitor-authored outline.'
});
```

This is an explicit navigation action, not a submission. The context is stored only in the current browser tab, bounded, validated, expires after one hour and is consumed once. Its URL contains only the controlled conversation destination, for example `/contact?project=nrth-tms`. Names, emails, custom questions and context text never enter that URL. The form selects the conversation, presents the carried perspectives and puts the starting text into an editable message. Copy, text-file save and removal are available before review. If tab storage is denied, a dialog retains the copyable/downloadable text and a link to a blank introduction.

The shared adapter observes deliberate interactions with the atlas, industry inspector, visual lab, scenario explorer, dependency example, investor comparison, connection handoff and evidence exhibits. Public selections can survive an intermediate page. The adapter intercepts ordinary same-tab contact links only when a starting point exists; modified clicks and new tabs retain normal browser behavior. It never transfers form identity fields. Both older partnership and research-outline handoffs remain readable.

For a new static exhibit, give its contact link these controlled attributes:

```html
<a href="/contact?project=nrth-labs"
   data-prepare-kind="work-study"
   data-prepare-label="Design study"
   data-prepare-value="A concise public description of the work inspected.">
  Discuss this study
</a>
```

For richer tools, call the exported API on the explicit continuation action. Keep the `project` and `kind` values in the enums defined by `src/data/inquiry-context.ts`; limits are eight records, 140 characters per label, 700 per value and 4,500 for an optional custom outline. Evidence-exhibit radios and existing selection attributes are collected without another renderer.

## Delivery and measurement

Prepared context does not establish an operational email provider. Sending remains a separate, reviewed action through the existing inquiry endpoint. Without Resend configuration, the endpoint reports unavailable delivery and preserves the email-app, copy and save alternatives. No message is sent automatically by discovery or preparation.

When `PUBLIC_ENABLE_ANALYTICS=true`, discovery events use an allowlist of action names and controlled venture, field and result-type enums. Queries and hash fragments are stripped from analytics page URLs. Unknown event properties, search text, custom outlines, names, emails and inquiry text are not copied into analytics. Review and provider acceptance are distinct events.

Validation: `node scripts/verify-discovery.mjs` checks matching, filters, ranking, text bounds and expiry. `node scripts/verify-discovery-browser.cjs` checks public indexing, keyboard/mobile search, context navigation, editable and expired outlines, legacy handoffs, storage denial and the complete no-JavaScript directory. Set `NRTH_TEST_URL` for another local preview and `CHROMIUM_PATH` for a CI-installed browser.
