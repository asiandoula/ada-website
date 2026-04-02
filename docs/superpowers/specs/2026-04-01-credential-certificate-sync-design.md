# Credential-Certificate Sync Redesign

## Problem

The system has three places storing certification dates (`doulas`, `doula_credentials`, `certificates`) with no single source of truth. This causes:

- Credential and certificate expiration dates diverging
- Old bug (3-year expiry) fixed in credentials but not certificates, leaving ~8 certificates with wrong dates
- Renew flow updating certificate first and credential second (backwards)
- No way to renew a credential directly; admin must delete old credential and add new one (losing original certification_date)

## Design Principles

1. **Credential is the source of truth** for "does this doula have this qualification and when does it expire"
2. **Certificate is a document** (PDF) that proves the credential. Its dates come FROM the credential, never the other way around.
3. **`doulas` table dates are denormalized copies** kept in sync for backward compatibility but never read as authoritative.

## Data Flow

```
Credential (source of truth)
    ├── expiration_date: authoritative
    ├── certification_date: authoritative
    │
    ├──► Certificate (document)
    │       ├── expiration_date: copied from credential
    │       ├── issued_date: when PDF was generated
    │       └── pdf_url: the actual file
    │
    └──► Doulas table (denormalized)
            ├── expiration_date: synced from credential
            └── certification_date: synced from credential
```

## Changes

### 1. Renew UI — Move to Credential Card

**Remove:** The standalone `RenewCertification` component at the bottom of the doula detail page.

**Add:** A "Renew" button on each credential card (visible when status is `active` or `expired`).

**Renew button behavior:**
1. Show confirmation with: current expiry → new expiry (default: current expiry + 1 year, editable date input)
2. On confirm:
   - Update `doula_credentials.expiration_date` to new date
   - Update `doula_credentials.status` to `active` (if was `expired`)
   - Call `/api/certificates/generate` to regenerate the certificate PDF (passing the credential's expiration_date)
   - Sync `doulas.expiration_date` 
   - Auto-prompt email dialog (same pattern as Grant Certification)

### 2. Certificate Generate API — Read from Credential

**Current:** `/api/certificates/generate` calculates expiration as `today + 1 year` or accepts `body.expiration_date`.

**Change to:**
1. Look up the credential for this `(doula_id, certificate_type)`
2. If no credential exists → return error 400: "Credential must exist before generating a certificate"
3. Read `expiration_date` from the credential
4. Use that as the certificate's expiration date (ignore any `body.expiration_date`)
5. `issued_date` remains `today` (when the PDF was generated)
6. Sync `doulas.certification_date` and `doulas.expiration_date` from the credential

### 3. Grant Certification — Credential First

**Current:** Grant Certification creates certificate first, then auto-creates credential.

**Change to:**
1. Create or update credential first (set `certification_date`, `expiration_date`, `status: active`)
2. Then generate certificate PDF (reads dates from credential)

The Grant Certification UI stays the same (certificate type selector + expiration date input). But internally the order flips: credential first, certificate second.

### 4. Data Migration

**Migration 011: Fix certificate expiration dates from credential source of truth**

```sql
-- Sync certificate expiration_date from credential (credential is correct)
UPDATE certificates c
SET expiration_date = dc.expiration_date
FROM doula_credentials dc
WHERE dc.doula_id = c.doula_id
  AND dc.credential_type = c.certificate_type
  AND dc.expiration_date IS NOT NULL
  AND c.expiration_date IS NOT NULL
  AND c.expiration_date != dc.expiration_date
  AND c.status != 'revoked';
```

**Batch PDF regeneration:**

After the migration runs, trigger PDF regeneration for all affected certificates. This can be done via a temporary admin endpoint or script that:
1. Queries certificates where `expiration_date` was updated by the migration
2. Calls the existing PDF generation logic for each one
3. Uploads new PDFs to storage (upsert overwrites old files)

### 5. Files to Modify

| File | Change |
|------|--------|
| `src/app/admin/(authenticated)/doulas/[id]/page.tsx` | Remove `RenewCertification` component. Add Renew button to credential cards. Update `GrantCertification` to create credential first. |
| `src/app/api/certificates/generate/route.ts` | Read expiration from credential instead of calculating. Remove `body.expiration_date` usage. Require credential to exist. |
| `supabase/migrations/011_sync_cert_dates_from_credentials.sql` | Fix certificate dates from credential source of truth. |

### 6. What Does NOT Change

- Certificate table schema (fields stay the same, just populated differently)
- Credential table schema (no changes needed)
- Doulas table schema (fields stay, just sync'd differently)
- Portal page (reads from both tables, no change needed)
- Verify page (reads from certificate, dates will now be correct)
- PDF template (same inputs, just gets correct dates now)
