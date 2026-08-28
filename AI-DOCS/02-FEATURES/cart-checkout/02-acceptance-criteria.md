# Acceptance Criteria — Cart & checkout

## AC-01
Empty cart shows empty state + link to `/urunler`.

## AC-02
Line qty uses the same tier helper as PDP.

## AC-03
Checkout blocked if cart empty.

## AC-04
Required: name, phone, TR city/district, address.

## AC-05
Success path continues to PayTR feature.

## Programmer tests

1. Add item → `/sepet` shows it
2. Change qty → totals update
3. Remove last item → empty
4. Fill checkout → pending order (even before PayTR wired: document if stub)
