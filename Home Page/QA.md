# Home validation — 2026-09-25

## Automated checks

`npm test`: **6 passing tests**.

1. Accordion begins closed, replaces the prior active card and closes on repeat selection.
2. Disabled, hidden and archived entries are filtered without deleting configuration.
3. Independent Journal/Products contract, unique IDs and safe local URL validation.
4. Missing/foreign admin identity, cross-origin write rejection, stale revision conflict and preserved disabled settings.
5. Configuration and owner survive a real SQLite close/reopen cycle on disk.
6. Database unavailability returns a recoverable 503.

Production `npm run build`: successful client bundle and Worker ESM output. D1 schema migration inspected; only two bounded CREATE TABLE statements. No runtime schema changes.

## Browser checks

- Desktop preview at approximately 1363px: asset loading, hero composition, footer/products and developer section visually reviewed.
- The initial four referral cards are closed. Opening Traders then Developers leaves one open panel and hides Trading Tools.
- Admin editor: disabling a service, saving, reloading and restoring it succeeded. Saved-state messages verified. Test edits stayed in the local preview database.
- A 390px iframe viewport: stacked layout visually checked; document client width and scroll width both 375px (15px browser scrollbar). Menu opened using the visible control and its `aria-expanded=true` / visible navigation were verified.
- A 1920px iframe viewport: content container 1440px, left offset 232.5px with a 15px scrollbar; no horizontal document overflow (1905px client and scroll width).
- Education renderer appeared in the mobile frame when selected.
- The supervised browser's full-page screenshot capture intermittently timed out; viewport screenshots were used. These were infrastructure capture errors, not application errors.

## Limits

This validates homepage behavior and the local persistence adapter. Production deployment status confirms publication; it is not an end-to-end test of financial services. Actual payments, trading, account login, videos and destination pages are not connected. D1 uses the same generated schema and prepared statements; the hosting service applies migrations.

Some assets are reference crops, as listed in README. Text embedded in images remains English, including when the principal interface switches to Persian. No claim of pixel-perfect identity or fully translated image content is made.

## Revision 2 — 2026-09-26

- 12 Node tests pass: existing authorization/persistence/concurrency and accordion behavior, legacy config migration, campaign boundaries and overlap, draft filtering, translation fallback, media upload/type rejection and range/HEAD responses.
- Browser: Persian desktop UI inspected; mobile 390px frame had clientWidth = scrollWidth = 375px (scrollbar excluded); device decoration remains anchored to devices.
- Browser: laptop enlargement dialog opens/closes; Hero Persian title saved, reloaded and restored in local development database.
- Browser: Community starter blocks create and render in preview after fixing ID generation for non-secure local preview contexts. No sample Community block published.
- Upload backend and byte ranges tested using in-memory storage. Actual production R2 upload, codec compatibility of user-provided videos, paid booking, external market feeds and automatic translation are not claimed verified.
- Reference fake videos/products/avatars removed from live homepage rendering. Default content lists remain empty until owner supplies genuine records.
- Build output excludes the local responsive QA iframe harness.
