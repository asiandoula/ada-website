# Credential-Certificate Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make credential the single source of truth for certification dates. Certificate reads from credential, not the other way around. Add renew button to credential cards. Fix bad data + regenerate PDFs.

**Architecture:** Flip the data flow: credential owns dates → certificate generate API reads from credential → doulas table synced from credential. Grant Certification creates credential first, then certificate. Renew operates on credential directly.

**Tech Stack:** Next.js 14 App Router, Supabase, TypeScript, React

**Spec:** `docs/superpowers/specs/2026-04-01-credential-certificate-sync-design.md`

---

### Task 1: Refactor certificate generate API to read dates from credential

**Files:**
- Modify: `src/app/api/certificates/generate/route.ts`

This is the core change. The API stops accepting `body.expiration_date` and instead reads from the credential table.

- [ ] **Step 1: Modify the API route to read expiration from credential**

Replace lines 87-94 (the expiration date calculation) and lines 167-213 (the doula sync + credential auto-create/update block) with credential-first logic.

The full new `route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateCertificatePDF } from '@/components/certificate/pdf-template';
import { generateVerificationCode, generateCertificateNumber } from '@/lib/utils';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doula_id, certificate_type } = body;

    const supabase = getSupabase();

    // Fetch doula
    const { data: doula, error: doulaError } = await supabase
      .from('doulas')
      .select('*')
      .eq('id', doula_id)
      .single();

    if (doulaError || !doula) {
      return NextResponse.json({ error: 'Doula not found' }, { status: 404 });
    }

    // Credential must exist — it is the source of truth
    const { data: credential } = await supabase
      .from('doula_credentials')
      .select('id, certification_date, expiration_date')
      .eq('doula_id', doula_id)
      .eq('credential_type', certificate_type)
      .single();

    if (!credential) {
      return NextResponse.json(
        { error: 'Credential must exist before generating a certificate. Add the credential first.' },
        { status: 400 }
      );
    }

    // Read dates from credential (source of truth)
    const issuedDate = new Date().toISOString().split('T')[0];
    const expirationDate = credential.expiration_date;

    // Check if this doula already has a certificate of this type
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('id, certificate_number, verification_code, pdf_url')
      .eq('doula_id', doula_id)
      .eq('certificate_type', certificate_type)
      .single();

    let certificateNumber: string;
    let verificationCode: string;
    let certId: string;

    if (existingCert) {
      certificateNumber = existingCert.certificate_number;
      verificationCode = existingCert.verification_code;
      certId = existingCert.id;
    } else {
      // Create new certificate record — find max sequence to avoid duplicates
      const year = new Date().getFullYear();
      const prefix = certificate_type === 'postpartum' ? 'PD' : certificate_type === 'birth' ? 'BD' : 'CPR';
      const numberPrefix = `ADA-${prefix}-${year}-`;

      const { data: latest } = await supabase
        .from('certificates')
        .select('certificate_number')
        .like('certificate_number', `${numberPrefix}%`)
        .order('certificate_number', { ascending: false })
        .limit(1)
        .single();

      let sequence = 1;
      if (latest) {
        const lastSeq = parseInt(latest.certificate_number.replace(numberPrefix, ''), 10);
        if (!isNaN(lastSeq)) sequence = lastSeq + 1;
      }

      certificateNumber = generateCertificateNumber(certificate_type, sequence);

      const { data: duplicate } = await supabase
        .from('certificates')
        .select('id')
        .eq('certificate_number', certificateNumber)
        .single();

      if (duplicate) {
        return NextResponse.json(
          { error: `Certificate number ${certificateNumber} already exists. Please try again.` },
          { status: 409 }
        );
      }

      verificationCode = generateVerificationCode();
      certId = '';
    }

    // Generate PDF
    console.log('Generating PDF for', doula.full_name, '...');
    const pdfBuffer = await generateCertificatePDF({
      fullName: doula.full_name,
      fullNameZh: doula.full_name_zh || undefined,
      certificateNumber,
      expirationDate,
    });
    console.log('PDF generated, size:', pdfBuffer.length);

    // Upload to Supabase Storage
    const storagePath = `certificates/${doula_id}/${certificateNumber}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('certificates').getPublicUrl(storagePath);

    let cert;
    if (existingCert) {
      const { data, error } = await supabase
        .from('certificates')
        .update({
          issued_date: issuedDate,
          expiration_date: expirationDate,
          pdf_url: publicUrl,
        })
        .eq('id', certId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: `Update failed: ${error.message}` }, { status: 500 });
      }
      cert = data;
    } else {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          doula_id,
          certificate_type,
          certificate_number: certificateNumber,
          issued_date: issuedDate,
          expiration_date: expirationDate,
          pdf_url: publicUrl,
          verification_code: verificationCode,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: `Save failed: ${error.message}` }, { status: 500 });
      }
      cert = data;
    }

    // Sync doula's dates from credential (denormalized copy)
    const { data: currentDoula } = await supabase
      .from('doulas')
      .select('status')
      .eq('id', doula_id)
      .single();

    const updateData: Record<string, string> = {
      certification_date: credential.certification_date || issuedDate,
      expiration_date: expirationDate,
    };
    if (currentDoula?.status === 'registered') {
      updateData.status = 'active';
    }

    await supabase
      .from('doulas')
      .update(updateData)
      .eq('id', doula_id);

    return NextResponse.json({ certificate: cert, pdf_url: publicUrl });
  } catch (err: unknown) {
    console.error('Certificate generation error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

Key changes from current code:
- Removed `body.expiration_date` usage — reads from credential instead
- Removed auto-create/update credential block (credential must already exist)
- `doulas.certification_date` synced from credential, not from `issuedDate`

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/certificates/generate/route.ts
git commit -m "refactor: certificate generate API reads dates from credential (source of truth)"
```

---

### Task 2: Refactor Grant Certification to create credential first

**Files:**
- Modify: `src/app/admin/(authenticated)/doulas/[id]/page.tsx` (GrantCertification component, ~lines 652-756)

Grant Certification currently calls the API which auto-creates the credential. Now the credential must exist first, so Grant Certification creates it before calling the API.

- [ ] **Step 1: Update GrantCertification onClick handler**

Replace the `onClick` handler (lines 717-748) with credential-first logic:

```typescript
onClick={async () => {
  if (!confirm(`Grant ${CERT_TYPE_LABELS[certType as CertificateType]} to ${doulaName}?`)) return;
  setLoading(true);
  setResult(null);

  // Step 1: Create credential first (source of truth)
  if (['postpartum', 'birth'].includes(certType)) {
    const { error: credError } = await supabase.from('doula_credentials').insert({
      doula_id: doulaId,
      credential_type: certType,
      status: 'active',
      certification_date: new Date().toISOString().split('T')[0],
      expiration_date: expDate,
    });
    if (credError) {
      alert(`Failed to create credential: ${credError.message}`);
      setLoading(false);
      return;
    }
  }

  // Step 2: Generate certificate PDF (reads dates from credential)
  const res = await fetch('/api/certificates/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doula_id: doulaId,
      certificate_type: certType,
    }),
  });
  const data = await res.json();
  if (res.ok) {
    setResult(`Certificate ${data.certificate?.certificate_number} generated. PDF ready for download.`);
    onDone();
    if (doulaEmail && data.certificate) {
      onEmailPrompt([{
        doula_id: doulaId,
        doula_name: doulaName,
        doula_id_code: doulaIdCode,
        email: doulaEmail,
        related_id: data.certificate.id,
        type: 'certificate',
      }]);
    }
  } else {
    alert(data.error || 'Generation failed');
  }
  setLoading(false);
}}
```

Note: `expiration_date` is no longer sent to the API — the API reads it from the credential we just created. The `supabase` client is available via `createClient()` at the top of `EditDoulaPage`.

We need to add `supabase` access. The `GrantCertification` component doesn't have it. Add it as a prop or create it inside. Simplest: create inside the component.

Add at the top of the `GrantCertification` function body:
```typescript
const supabase = createClient();
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/(authenticated)/doulas/[id]/page.tsx
git commit -m "refactor: Grant Certification creates credential first, then generates certificate"
```

---

### Task 3: Add Renew button to credential cards + remove RenewCertification

**Files:**
- Modify: `src/app/admin/(authenticated)/doulas/[id]/page.tsx`

- [ ] **Step 1: Add Renew button to credential card**

In the credential card JSX (after the delete button, around line 230), add a Renew button. Insert this after the closing `</button>` of the delete button and before the closing `</div>` of the `flex gap-1` container:

```typescript
{(cred.status === 'active' || cred.status === 'expired') && cred.credential_type !== 'ibclc_training' && (
  <button
    className="text-ada-purple hover:text-ada-purple/80 text-xs px-1 font-medium"
    title="Renew credential"
    onClick={async () => {
      const currentExp = cred.expiration_date;
      const baseDate = currentExp && new Date(currentExp) > new Date() ? new Date(currentExp) : new Date();
      const newExp = new Date(new Date(baseDate).setFullYear(new Date(baseDate).getFullYear() + 1)).toISOString().split('T')[0];
      const renewDate = prompt(`Renew ${CREDENTIAL_LABELS[cred.credential_type as CredentialType]}?\n\nCurrent expiry: ${currentExp ?? 'Not set'}\nNew expiry (edit if needed):`, newExp);
      if (!renewDate) return;

      // Step 1: Update credential (source of truth)
      const { error: credErr } = await supabase.from('doula_credentials').update({
        expiration_date: renewDate,
        status: 'active',
        updated_at: new Date().toISOString(),
      }).eq('id', cred.id);
      if (credErr) { alert(`Failed to renew: ${credErr.message}`); return; }

      // Step 2: Regenerate certificate PDF (reads new date from credential)
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doula_id: params.id,
          certificate_type: cred.credential_type,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'PDF regeneration failed');
      }

      reloadData();
    }}
  >
    Renew
  </button>
)}
```

- [ ] **Step 2: Remove the RenewCertification component and its usage**

Delete the entire `RenewCertification` function (lines 758-816) and its JSX usage in the main component (lines 369-377):

Remove this JSX block:
```typescript
{/* Renew Certification — when there are existing certs */}
{certs.length > 0 && !['revoked', 'suspended'].includes(doula.status) && (
  <RenewCertification
    doula={doula}
    doulaId={params.id as string}
    loading={loading}
    setLoading={setLoading}
    onDone={reloadData}
  />
)}
```

Delete the entire `function RenewCertification(...)` block.

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/(authenticated)/doulas/[id]/page.tsx
git commit -m "feat: add Renew button to credential cards, remove standalone RenewCertification"
```

---

### Task 4: Data migration — sync certificate dates from credential + batch PDF regen

**Files:**
- Create: `supabase/migrations/011_sync_cert_dates_from_credentials.sql`
- Create: `src/app/api/certificates/regenerate-all/route.ts` (temporary endpoint)

- [ ] **Step 1: Create migration 011**

```sql
-- Sync certificate expiration_date from credential (credential is source of truth)
-- This fixes certificates that had wrong 3-year expiry dates
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

- [ ] **Step 2: Create temporary batch regenerate endpoint**

This endpoint regenerates PDFs for all active certificates. It's meant to be called once manually, then can be removed.

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateCertificatePDF } from '@/components/certificate/pdf-template';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST() {
  try {
    const supabase = getSupabase();

    // Get all active certificates with their doula info
    const { data: certs, error } = await supabase
      .from('certificates')
      .select('id, doula_id, certificate_number, expiration_date, certificate_type')
      .neq('status', 'revoked')
      .order('certificate_number');

    if (error || !certs) {
      return NextResponse.json({ error: error?.message || 'No certs found' }, { status: 500 });
    }

    const results: { number: string; status: string; error?: string }[] = [];

    for (const cert of certs) {
      try {
        const { data: doula } = await supabase
          .from('doulas')
          .select('full_name, full_name_zh')
          .eq('id', cert.doula_id)
          .single();

        if (!doula) {
          results.push({ number: cert.certificate_number, status: 'skipped', error: 'Doula not found' });
          continue;
        }

        const pdfBuffer = await generateCertificatePDF({
          fullName: doula.full_name,
          fullNameZh: doula.full_name_zh || undefined,
          certificateNumber: cert.certificate_number,
          expirationDate: cert.expiration_date,
        });

        const storagePath = `certificates/${cert.doula_id}/${cert.certificate_number}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(storagePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          results.push({ number: cert.certificate_number, status: 'error', error: uploadError.message });
        } else {
          const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(storagePath);
          await supabase.from('certificates').update({
            pdf_url: publicUrl,
            issued_date: new Date().toISOString().split('T')[0],
          }).eq('id', cert.id);
          results.push({ number: cert.certificate_number, status: 'ok' });
        }
      } catch (e) {
        results.push({ number: cert.certificate_number, status: 'error', error: String(e) });
      }
    }

    const ok = results.filter(r => r.status === 'ok').length;
    const errors = results.filter(r => r.status === 'error').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    return NextResponse.json({
      total: certs.length,
      ok,
      errors,
      skipped,
      details: results,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/011_sync_cert_dates_from_credentials.sql src/app/api/certificates/regenerate-all/route.ts
git commit -m "feat: migration 011 to sync cert dates + batch PDF regeneration endpoint"
```

---

### Task 5: TypeScript check, review, push

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 2: Review all changes**

Run: `git diff origin/main --stat` and `git log origin/main..HEAD --oneline` to verify everything looks correct.

- [ ] **Step 3: Push**

```bash
git push origin main
```

- [ ] **Step 4: Run migration 011 in Supabase SQL Editor**

Go to Supabase SQL Editor for project `sztqpeebrvgualvegbxd` and run the contents of `011_sync_cert_dates_from_credentials.sql`.

Verify with:
```sql
SELECT count(*) FROM certificates c
JOIN doula_credentials dc ON dc.doula_id = c.doula_id AND dc.credential_type = c.certificate_type
WHERE c.expiration_date != dc.expiration_date AND c.status != 'revoked';
```
Expected: 0 rows

- [ ] **Step 5: Trigger batch PDF regeneration**

After Vercel deploys, call:
```bash
curl -X POST https://www.asiandoula.org/api/certificates/regenerate-all
```

Verify response shows all certificates regenerated successfully.

- [ ] **Step 6: Remove temporary endpoint**

After confirming all PDFs regenerated:
```bash
rm src/app/api/certificates/regenerate-all/route.ts
git add -A && git commit -m "chore: remove temporary batch regenerate endpoint"
git push origin main
```
