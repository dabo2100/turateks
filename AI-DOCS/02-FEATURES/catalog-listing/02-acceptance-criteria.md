# Acceptance Criteria — Catalog listing

## AC-01
`/urunler` shows a grid of products with name, SKU, from-price.

## AC-02
Active category in the sidebar is visually selected (orange).

## AC-03
Tag chips filter the grid; selected chip is obvious.

## AC-04
Sort: default, price asc/desc, name A–Z.

## AC-05
Zero results: empty state, not a blank page.

## Programmer tests

1. Open `/urunler`
2. Click a category — URL or state changes; grid updates
3. Click a tag — grid updates
4. Change sort — order changes
5. Hover card on desktop — extra image if present
