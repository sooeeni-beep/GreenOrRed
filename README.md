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


## 31. Expert storefront artwork alignment

Expert platform selections share the Indicator light surface and green outline. Safe and trusted promise artwork is cropped before text without clipping the icon; the delivery icon excludes adjacent artwork and lettering. The robot sits slightly left of the handwritten Hero art on desktop. At mobile widths (700px and below), handwritten Hero artwork is hidden and the robot is centered. Handwritten art remains an image and is not automatically translated.


## 32. Shared approved Hero background

Home, Indicators and Experts use the same approved ivory, diagonal-ribbon and candlestick background stored in Home Page/assets/shared-hero-background.webp. A single optimized asset is reused across pages. Future Hero sections should use the shared-hero CSS class. The previous Home chart decoration is hidden to avoid layering two chart backgrounds. Foreground artwork and handwritten images remain independent.


## 33. Hero background refinement

Approved replacement uses larger, more widely spaced pale candlesticks to reduce visual interference with foreground handwriting. Ivory diagonal ribbons remain. Journal and video motifs were reviewed and removed; the shared artwork contains no such symbols. The same asset is used on Home, Indicators and Experts.


## 34. Scripts & Utilities storefront

Route: /marketplace/scripts; owner manager: /scripts-preview/manage. Home Trading Tools, Marketplace navigation and footer link to this page. Header, footer, typography, page width, platform outline selection, sticky filters, grid/list layout and View More (8 initial, 8 additional per click) follow the existing storefronts. Hero and custom-request workflow artwork come from Scripts & Utilities/assets. Shared approved Hero background is reused; handwritten art remains an English image and is hidden on small screens. All changing labels are rendered as EN/FA code text.

Catalog is separate from Indicators and Experts and persisted as scripts-catalog in existing home_state storage, with owner authorization and revision-conflict protection. Products support bilingual copy, artwork uploads, platform/category, Free (zero price), draft/published, badges and restricted-access metadata. The supplied sample product cards are illustrative and are not seeded as real listings; the store begins empty until the owner publishes products. Checkout, downloads, reviews, seller accounts and custom-request fulfillment are not connected; existing preview messages make this explicit. Before production, integrate these services and server-enforced entitlements. Source category taxonomy: automation, chart tools, risk management, session/time, data/analysis, miscellaneous. Platform assets include NinjaTrader, so it remains available alongside the four platforms in the mockup.


## 35. Updated Scripts Hero icons

The five Hero feature icons now use the redesigned assets with the exact case-sensitive filenames ending in In Hero.png. Icon-specific crop widths preserve the full artwork while excluding baked-in English text; translated feature labels remain live text. Original PNGs are retained and optimized WebP derivatives are generated during build.


## 36. Platform-specific utility labels

Scripts storefront platform tabs retain platform names and show localized tool-type labels: MetaTrader 4/5 — Scripts & Utilities; cTrader — Plugins & Utilities; TradingView — Pine Tools; NinjaTrader — Add-ons & Utilities. This labeling distinguishes native tool types without altering platform filtering or product storage.


## 37. Cross-page storefront navigation

All storefront header menus use real internal route links; dropdowns close when a destination is selected. Footers share a destination map for Home, Indicators, Experts and Scripts so visitors can move directly between built pages. Client-side navigation preserves the active Site session and language preference and supports browser Back/Forward. Unbuilt destinations retain their existing preview behavior. Brand logos link to Home.
