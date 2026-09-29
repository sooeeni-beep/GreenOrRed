# Expert & Strategy preview

This page mirrors the production-safe architecture already used by the Indicator preview and follows the authoritative decisions in `Home Page/README.md`.

- Store: `/expert-preview`; canonical marketplace route: `/marketplace/experts`
- Owner management: `/expert-preview/manage`
- Reference: `Expert & Strategy Page.png`; source artwork: `assets/`
- `scripts/assets.mjs`: deterministic WebP derivatives from the supplied artwork.
- `src/`: bilingual responsive storefront and owner manager using the shared Home chrome and Indicator layout system.
- `shared/catalog.mjs`: validation, five platforms, strategy types, performance fields and filters.
- `server/catalog.mjs`: isolated durable catalog row with owner authorization and revision conflicts.
- `tests/catalog.test.mjs`: privacy, authorization, persistence, validation and filtering.

No sample products are seeded. Ratings, sales totals and performance are not fabricated. “Verified Results Only” only includes records explicitly marked verified; verified records require Profit Factor, Win Rate and Max Drawdown.

Checkout, license delivery, malware scanning, backtest verification and payments are not connected in this preview.
