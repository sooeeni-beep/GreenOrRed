# GreenOrRed

The homepage application and execution roadmap are in [Home Page/README.md](Home%20Page/README.md).

**Private TEST DEMO:** https://greenorred-home-test.s-o-o-e-e-n-i.chatgpt.site

Run from this repository root with Node 24:

```sh
npm ci
npm run assets
npm run dev
```

`npm test` checks module visibility, validation, authorization, concurrency and persistence. `npm run build` produces the deployable client and Worker.

Indicator preview: `/indicator-preview` · Owner manager: `/indicator-preview/manage`. The initial catalog is intentionally empty. See [Indicator Page/README.md](Indicator%20Page/README.md) and section 21 of the shared roadmap. Home navigation now connects to `/marketplace/indicators`; the original preview route remains available. See roadmap section 22.
