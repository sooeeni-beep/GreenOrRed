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
