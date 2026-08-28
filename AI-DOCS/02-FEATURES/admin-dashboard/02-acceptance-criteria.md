# Acceptance Criteria — Admin dashboard

## AC-01
Non-admin → `/admin` denied.

## AC-02
Owner can create/edit a product including a variant and a tier row.

## AC-03
Owner can mark order processing/shipped (status set TBD).

## AC-04
Owner can edit a legal page body.

## Programmer tests

1. Login as admin
2. Create product, appear on `/urunler`
3. Change price tier → PDP updates
4. Edit KVKK → public page updates
