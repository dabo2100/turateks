# Acceptance Criteria — Design system & shell

## AC-01
**Given** `/`  
**Then** header shows official logo + Turkish nav: Ürünler, Toptan, Hakkımızda, Blog, İletişim.

## AC-02
**Then** primary button / price accent uses token orange `#F58220` (or CSS var `--color-brand`).

## AC-03
**Then** footer lists NAP placeholders or settings (when settings exist), plus legal links.

## AC-04
**Then** mobile nav works without horizontal scroll; cart/search icons exist (can be non-functional until those features).

## AC-05
**Then** a missing route shows branded 404.

## Programmer tests

1. `npm run dev` → `/`
2. Resize to 390px — menu opens
3. Click Ürünler — route exists (even if empty catalog)
4. Contrast: white text on dark header readable
