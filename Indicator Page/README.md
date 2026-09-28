# Indicator preview

The authoritative decisions and roadmap are maintained in [Home Page/README.md](../Home%20Page/README.md), section 21.

- Store: `/indicator-preview`
- Owner management: `/indicator-preview/manage`
- Reference: `Indicator Page.png`; originals: `assets/`
- `scripts/assets.mjs`: deterministic crops and WebP derivatives, invoked by the shared build.
- `src/`: isolated React store, matching Home chrome, bilingual owner manager and scoped CSS.
- `shared/catalog.mjs`: validation, platforms, categories and filter rules.
- `server/catalog.mjs`: durable catalog row and revision-guarded updates through the existing owner authorization.
- `tests/catalog.test.mjs`: catalog privacy, authorization, persistence, Home isolation and filtering.

Run all commands from the repository root. `npm run assets` prepares both pages; `npm run dev` starts the preview; `npm test` checks shared and indicator behavior; `npm run build` packages the client and Worker. No sample products are seeded. Upload a real image and complete product fields in Manage, set Published, save and refresh the store. This is a storefront preview; checkout and product delivery are not implemented.
