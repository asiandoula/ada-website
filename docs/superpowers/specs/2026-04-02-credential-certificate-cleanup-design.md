# Credential-Certificate System Cleanup

## Problem

The credential/certificate system has accumulated confusion:
- Certificate is treated as 1:1 with credential (regenerate overwrites), should be 1:N (each renew creates a new certificate)
- Doula profile form has `certification_date` / `expiration_date` fields that bypass the credential system
- Verify page shows certificate info instead of credential info
- Status logic is scattered across doula, credential, and certificate levels
- Multiple places store and compute dates independently

## Core Model

```
Doula (person)
 └── Credential (identity/qualification — one per type)
      │   credential_type: postpartum | birth | ibclc_training
      │   status: active | expired | suspended | revoked | retired
      │   certification_date: when first certified
      │   expiration_date: when current period expires (NULL = permanent)
      │
      ├── Certificate (document — many per credential, one active at a time)
      │     certificate_number: ADA-PD-2026-0040 (unique, never reused)
      │     issued_date: when this PDF was generated
      │     expiration_date: copied from credential at time of generation
      │     status: active | superseded | revoked
      │     pdf_url: download link
      │     verification_code: for public lookup
      │
      ├── Certificate (older, superseded)
      └── Certificate (oldest, superseded)
```

**Rules:**
- Credential is the source of truth for "does this person have this qualification"
- Certificate is a document artifact (PDF). Each renew creates a NEW certificate. Old ones become `superseded`.
- Doula-level status (suspended/revoked) overrides all credential statuses when displayed publicly
- Revoke happens at credential level (not doula level). A doula can have postpartum revoked but birth active.
- CPR has no credential — it's certificate-only with its own expiration

## Renew Workflow

1. Admin clicks "Renew" on a credential card
2. Credential's `expiration_date` is updated (default: current expiry + 1 year, editable)
3. All existing active certificates of that type for that doula are marked `superseded`
4. A NEW certificate is created (new number, new PDF, reads expiration from credential)
5. Doula table's `expiration_date` is synced from credential
6. Email dialog auto-prompts

## Grant Certification Workflow

1. Admin selects certificate type and expiration date
2. Credential is created (or error if already exists)
3. New certificate is generated (reads dates from credential)
4. Doula table synced

## Data Changes

### Doula Profile Form — Remove date fields

Remove `certification_date` and `expiration_date` from the admin profile edit form (`handleSubmit`). These fields should not be manually editable — they are derived from credentials.

The `doulas` table still has these columns (for backward compatibility / denormalization), but they are ONLY written by:
- The certificate generate API (syncs from credential)
- The credential renew flow

### Certificate Table — Allow 1:N

Currently the certificate generate API checks for an existing cert by `(doula_id, certificate_type)` and updates it. Change to:
- Always INSERT a new certificate record
- Before inserting, UPDATE all existing active certificates of the same `(doula_id, certificate_type)` to `status = 'superseded'`
- Each certificate gets a unique `certificate_number` and `verification_code`

### Certificate Status Values

Add `superseded` to the certificate status check constraint:
```sql
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_status_check;
ALTER TABLE certificates ADD CONSTRAINT certificates_status_check 
  CHECK (status IN ('active', 'superseded', 'revoked'));
```

## Frontend Changes

### Verify Page (`/verify/[code]`)

**Title:** "Credential Verification" (not "Certificate Verification")

**Lookup logic:**
- Input a verification_code, certificate_number, or doula_id_code
- Find the doula
- Display ALL credentials for that doula (not just the one matching the lookup)

**Display per credential:**
```
┌─────────────────────────────────────────┐
│ Postpartum Doula          ● Active      │
│ Valid Through              Apr 30, 2027 │
│ Certificate               ADA-PD-2027-0015 │
├─────────────────────────────────────────┤
│ Birth Doula               ● Active      │
│ Valid Through              Apr 30, 2027 │
│ Certificate               ADA-BD-2026-0005 │
└─────────────────────────────────────────┘
```

**Status banner logic:**
- All credentials active → "VERIFIED — ACTIVE"
- Doula-level suspended/revoked → overrides everything, show that status
- Any credential expired → "PARTIALLY EXPIRED" (show which ones)
- All credentials expired → "EXPIRED"
- Any credential revoked (but doula not revoked) → show per-credential status

**Certificate number shown:** For each credential, show the latest active (non-superseded, non-revoked) certificate number. If someone looks up an old superseded certificate number, still show the doula's current credential status (not the old certificate's status).

### Portal Page (`/portal`)

**Certificates section:**
- Group by credential type
- Show ALL certificates (including superseded) ordered by issued_date desc
- Superseded certificates: gray "Superseded" badge, but still downloadable
- Active certificate: normal styling with download button

### Admin Doula Detail Page (`/admin/doulas/[id]`)

**Profile form:**
- REMOVE `Certification Date` field
- REMOVE the auto-calculated `expiration_date` from `handleSubmit`
- Keep all other fields (name, email, phone, DOB, status, exam_status, training_provider, region)

**Credentials card:**
- Keep as-is (editable dates, status dropdown, delete, renew)

**Certificates table:**
- Show ALL certificates (including superseded)
- Status column: Active / Superseded / Revoked
- Superseded rows: slightly dimmed (like revoked rows currently are)
- "Regen PDF" button only on active certificates
- "Revoke" button only on active certificates

**Grant Certification:**
- Keep as-is (create credential + generate certificate)

## Files to Modify

| File | Change |
|------|--------|
| `src/app/api/certificates/generate/route.ts` | Always INSERT new cert, supersede old ones. Remove update-existing logic. |
| `src/app/admin/(authenticated)/doulas/[id]/page.tsx` | Remove cert_date/exp_date from profile form. Update certificates table to show superseded. |
| `src/app/(public)/verify/[code]/page.tsx` | Rewrite to show all credentials per doula. Title change. |
| `src/app/(public)/portal/page.tsx` | Group certificates, show superseded with badge. |
| `supabase/migrations/012_add_superseded_status.sql` | Add 'superseded' to certificate status constraint. |

## What Does NOT Change

- Credential table schema (no changes)
- Doula table schema (columns stay, just stop editing them in profile form)
- Exam results (unrelated)
- Email system (unrelated)
- Portal i18n (already done)
- PDF template (same inputs)
