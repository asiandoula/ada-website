# Credential-Certificate Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix credential/certificate data model so credential is the identity (1:N certificates), certificates are documents that get superseded on renew, and all stale date fields are cleaned up.

**Architecture:** Certificate generate API always inserts new certs (superseding old). Verify page shows all credentials per doula. Profile form stops writing certification dates. Data migration backfills missing credentials and adds superseded status.

**Tech Stack:** Next.js 14 App Router, Supabase, TypeScript, React

**Spec:** `docs/superpowers/specs/2026-04-02-credential-certificate-cleanup-design.md`

---

### Task 1: Database migrations (superseded status + backfill credentials)

**Files:**
- Create: `supabase/migrations/012_add_superseded_cert_status.sql`
- Create: `supabase/migrations/013_backfill_missing_credentials.sql`

- [ ] **Step 1: Create migration 012 — add superseded status**

```sql
-- Add 'superseded' to certificate status values
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_status_check;
ALTER TABLE certificates ADD CONSTRAINT certificates_status_check 
  CHECK (status IN ('active', 'superseded', 'revoked'));
```

Write to `supabase/migrations/012_add_superseded_cert_status.sql`.

- [ ] **Step 2: Create migration 013 — backfill missing credentials**

```sql
-- Create postpartum credentials for doulas that have certification dates but no credential record
INSERT INTO doula_credentials (doula_id, credential_type, status, certification_date, expiration_date)
SELECT d.id, 'postpartum', 'active', d.certification_date, d.expiration_date
FROM doulas d
LEFT JOIN doula_credentials dc ON dc.doula_id = d.id AND dc.credential_type = 'postpartum'
WHERE dc.id IS NULL
  AND d.certification_date IS NOT NULL;
```

Write to `supabase/migrations/013_backfill_missing_credentials.sql`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/012_add_superseded_cert_status.sql supabase/migrations/013_backfill_missing_credentials.sql
git commit -m "feat: migrations 012-013 — superseded cert status + backfill missing credentials"
```

---

### Task 2: Refactor certificate generate API — always insert, supersede old

**Files:**
- Modify: `src/app/api/certificates/generate/route.ts`

The API currently checks for an existing cert and updates it. Change to: always supersede existing active certs, then insert a new one.

- [ ] **Step 1: Replace the full route.ts**

Replace the entire file with:

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

    // For credential-backed types, credential must exist as source of truth
    const credentialTypes = ['postpartum', 'birth', 'ibclc_training'];
    const issuedDate = new Date().toISOString().split('T')[0];
    let expirationDate: string;
    let credential: { id: string; certification_date: string; expiration_date: string } | null = null;

    if (credentialTypes.includes(certificate_type)) {
      const { data: cred } = await supabase
        .from('doula_credentials')
        .select('id, certification_date, expiration_date')
        .eq('doula_id', doula_id)
        .eq('credential_type', certificate_type)
        .single();

      if (!cred) {
        return NextResponse.json(
          { error: 'Credential must exist before generating a certificate. Add the credential first.' },
          { status: 400 }
        );
      }
      credential = cred;
      expirationDate = cred.expiration_date;
    } else {
      expirationDate = body.expiration_date || new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split('T')[0];
    }

    // Supersede all existing active certificates of this type for this doula
    await supabase
      .from('certificates')
      .update({ status: 'superseded', updated_at: new Date().toISOString() })
      .eq('doula_id', doula_id)
      .eq('certificate_type', certificate_type)
      .eq('status', 'active');

    // Generate new certificate number
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

    const certificateNumber = generateCertificateNumber(certificate_type, sequence);

    // Double-check uniqueness
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

    const verificationCode = generateVerificationCode();

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

    // Always insert new certificate
    const { data: cert, error: insertError } = await supabase
      .from('certificates')
      .insert({
        doula_id,
        certificate_type,
        certificate_number: certificateNumber,
        issued_date: issuedDate,
        expiration_date: expirationDate,
        pdf_url: publicUrl,
        verification_code: verificationCode,
        status: 'active',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: `Save failed: ${insertError.message}` }, { status: 500 });
    }

    // Sync doula's dates from credential (denormalized copy)
    const { data: currentDoula } = await supabase
      .from('doulas')
      .select('status')
      .eq('id', doula_id)
      .single();

    const updateData: Record<string, string> = {
      certification_date: credential?.certification_date || issuedDate,
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

Key changes from current:
- Removed the `existingCert` update path — always INSERT new certificate
- Added supersede step: UPDATE all active certs of same type to `superseded` before inserting
- Always generates new certificate_number and verification_code

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/certificates/generate/route.ts
git commit -m "refactor: certificate API always inserts new cert, supersedes old ones"
```

---

### Task 3: Admin page — remove stale date fields from profile form + update certificates table

**Files:**
- Modify: `src/app/admin/(authenticated)/doulas/[id]/page.tsx`

- [ ] **Step 1: Remove certification_date from profile form and handleSubmit**

In `handleSubmit` (around line 83), remove the `certDate` and `expDate` calculation and remove `certification_date` and `expiration_date` from the update object:

Replace:
```typescript
    const form = new FormData(e.currentTarget);
    const certDate = form.get('certification_date') as string;
    const expDate = certDate
      ? new Date(
          new Date(certDate).setFullYear(new Date(certDate).getFullYear() + 1)
        )
          .toISOString()
          .split('T')[0]
      : null;

    const { error } = await supabase
      .from('doulas')
      .update({
        full_name: form.get('full_name'),
        full_name_zh: form.get('full_name_zh') || null,
        email: form.get('email') || null,
        phone: form.get('phone') || null,
        date_of_birth: form.get('date_of_birth') || null,
        certification_date: certDate || null,
        expiration_date: expDate,
        status: form.get('status'),
        exam_status: form.get('exam_status'),
        training_provider: form.get('training_provider') || null,
        region: form.get('region') || null,
      })
      .eq('id', params.id);
```

With:
```typescript
    const form = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('doulas')
      .update({
        full_name: form.get('full_name'),
        full_name_zh: form.get('full_name_zh') || null,
        email: form.get('email') || null,
        phone: form.get('phone') || null,
        date_of_birth: form.get('date_of_birth') || null,
        status: form.get('status'),
        exam_status: form.get('exam_status'),
        training_provider: form.get('training_provider') || null,
        region: form.get('region') || null,
      })
      .eq('id', params.id);
```

Remove the Certification Date field from the form JSX (around line 361-368):
```typescript
              <div>
                <Label>Certification Date</Label>
                <Input
                  name="certification_date"
                  type="date"
                  defaultValue={doula.certification_date ?? ''}
                />
              </div>
```

Replace that `<div>` with an empty `<div />` or remove it and adjust the grid.

- [ ] **Step 2: Update certificates table to show status column with superseded**

In the certificates table (around line 495-575), the Status column currently only shows Active/Revoked. Update it to also show Superseded. 

Find this block:
```typescript
                    <td className="p-2">
                      {cert.status === 'revoked' ? (
                        <Badge className="bg-red-100 text-red-800">Revoked</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </td>
```

Replace with:
```typescript
                    <td className="p-2">
                      {cert.status === 'revoked' ? (
                        <Badge className="bg-red-100 text-red-800">Revoked</Badge>
                      ) : cert.status === 'superseded' ? (
                        <Badge className="bg-gray-100 text-gray-500">Superseded</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </td>
```

Also update the row opacity — superseded rows should be dimmed like revoked:

Find:
```typescript
                  <tr key={cert.id} className={`border-b ${cert.status === 'revoked' ? 'opacity-50' : ''}`}>
```

Replace with:
```typescript
                  <tr key={cert.id} className={`border-b ${cert.status === 'revoked' || cert.status === 'superseded' ? 'opacity-50' : ''}`}>
```

Also update the action buttons — Regen PDF and Revoke should only show for active certs. Find:
```typescript
                      {cert.status !== 'revoked' && (
```

Replace with:
```typescript
                      {cert.status === 'active' && (
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/(authenticated)/doulas/[id]/page.tsx
git commit -m "fix: remove stale cert dates from profile form, show superseded certs in admin"
```

---

### Task 4: Rewrite verify page — show all credentials per doula

**Files:**
- Modify: `src/app/(public)/verify/[code]/page.tsx`

This is a full rewrite. The page currently shows one certificate. It needs to show all credentials for the doula.

- [ ] **Step 1: Replace the entire verify page**

```typescript
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { CREDENTIAL_LABELS } from '@/lib/constants';
import type { CredentialType } from '@/lib/constants';
import { ShieldCheck, ShieldAlert, ShieldX, Search, ArrowLeft } from 'lucide-react';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

interface CredentialRow {
  credential_type: string;
  status: string;
  expiration_date: string | null;
}

interface CertificateRow {
  certificate_number: string;
  certificate_type: string;
  status: string;
}

export default async function VerifyResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const supabase = getSupabase();
  const { code } = await params;
  const decoded = decodeURIComponent(code);

  // Find the doula — try verification_code, certificate_number, doula_id_code
  let doulaId: string | null = null;
  let doulaInfo: Record<string, string> | null = null;

  // 1. Verification code → find certificate → get doula
  const { data: byVerification } = await supabase
    .from('certificates')
    .select('doula_id, doulas(id, full_name, full_name_zh, doula_id_code, status)')
    .eq('verification_code', decoded)
    .limit(1)
    .single();

  if (byVerification) {
    doulaId = byVerification.doula_id;
    doulaInfo = byVerification.doulas as Record<string, string>;
  }

  // 2. Certificate number
  if (!doulaId) {
    const { data: byCertNum } = await supabase
      .from('certificates')
      .select('doula_id, doulas(id, full_name, full_name_zh, doula_id_code, status)')
      .eq('certificate_number', decoded.toUpperCase())
      .limit(1)
      .single();

    if (byCertNum) {
      doulaId = byCertNum.doula_id;
      doulaInfo = byCertNum.doulas as Record<string, string>;
    }
  }

  // 3. Doula ID code
  if (!doulaId) {
    const normalizedId = decoded.startsWith('#') ? decoded : `#${decoded}`;
    const { data: byDoulaId } = await supabase
      .from('doulas')
      .select('id, full_name, full_name_zh, doula_id_code, status')
      .eq('doula_id_code', normalizedId)
      .single();

    if (byDoulaId) {
      doulaId = byDoulaId.id;
      doulaInfo = byDoulaId as unknown as Record<string, string>;
    }
  }

  // ============ NOT FOUND ============
  if (!doulaId || !doulaInfo) {
    return (
      <>
        <section className="bg-ada-navy pt-32 pb-20 md:pt-40 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
          }} />
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/5">
              <ShieldX className="w-8 h-8 text-white/60" />
            </div>
            <h1 className="font-dm-serif text-3xl md:text-4xl text-white">
              Record Not Found
            </h1>
            <p className="mt-4 text-white/60 font-outfit max-w-md mx-auto leading-relaxed">
              The query &ldquo;{decoded}&rdquo; does not match any record in the ADA registry.
            </p>
            <Link
              href="/verify"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-5 py-2.5 text-sm font-outfit font-medium hover:bg-white/20 transition-colors"
            >
              <Search className="w-4 h-4" /> Try Again
            </Link>
          </div>
        </section>
      </>
    );
  }

  // ============ FOUND — fetch all credentials + latest active cert per type ============
  const { data: credentials } = await supabase
    .from('doula_credentials')
    .select('credential_type, status, expiration_date')
    .eq('doula_id', doulaId)
    .order('credential_type');

  const { data: activeCerts } = await supabase
    .from('certificates')
    .select('certificate_number, certificate_type, status')
    .eq('doula_id', doulaId)
    .eq('status', 'active')
    .order('issued_date', { ascending: false });

  const creds: CredentialRow[] = credentials ?? [];
  const certs: CertificateRow[] = activeCerts ?? [];

  // Doula-level overrides
  const doulaStatus = doulaInfo.status;
  const isDoulaRevoked = doulaStatus === 'revoked';
  const isDoulaSuspended = doulaStatus === 'suspended';
  const isDoulaUnderInvestigation = doulaStatus === 'under_investigation';
  const isDoulaRetired = doulaStatus === 'retired';

  // Determine overall status banner
  let overallStatus: string;
  let bannerColor: string;
  let bannerIcon: React.ReactNode;

  if (isDoulaRevoked) {
    overallStatus = 'CREDENTIAL REVOKED';
    bannerColor = 'bg-red-600';
    bannerIcon = <ShieldX className="w-10 h-10 text-red-200" />;
  } else if (isDoulaSuspended) {
    overallStatus = 'CREDENTIAL SUSPENDED';
    bannerColor = 'bg-red-600';
    bannerIcon = <ShieldX className="w-10 h-10 text-red-200" />;
  } else if (isDoulaUnderInvestigation) {
    overallStatus = 'CREDENTIAL UNDER REVIEW';
    bannerColor = 'bg-amber-600';
    bannerIcon = <ShieldAlert className="w-10 h-10 text-amber-200" />;
  } else if (isDoulaRetired) {
    overallStatus = 'RETIRED — IN GOOD STANDING';
    bannerColor = 'bg-gray-500';
    bannerIcon = <ShieldAlert className="w-10 h-10 text-gray-200" />;
  } else if (creds.length === 0) {
    overallStatus = 'NO CREDENTIALS ON FILE';
    bannerColor = 'bg-gray-500';
    bannerIcon = <ShieldAlert className="w-10 h-10 text-gray-200" />;
  } else {
    const allExpired = creds.every(c => c.expiration_date && new Date(c.expiration_date) < new Date());
    const anyRevoked = creds.some(c => c.status === 'revoked');
    if (anyRevoked) {
      overallStatus = 'CREDENTIAL ISSUE — SEE DETAILS';
      bannerColor = 'bg-amber-600';
      bannerIcon = <ShieldAlert className="w-10 h-10 text-amber-200" />;
    } else if (allExpired) {
      overallStatus = 'EXPIRED';
      bannerColor = 'bg-amber-600';
      bannerIcon = <ShieldAlert className="w-10 h-10 text-amber-200" />;
    } else {
      overallStatus = 'VERIFIED — ACTIVE';
      bannerColor = 'bg-emerald-600';
      bannerIcon = <ShieldCheck className="w-10 h-10 text-emerald-200" />;
    }
  }

  return (
    <>
      {/* Header */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
        }} />
        <div className="relative max-w-[1000px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/ada-logo-white.svg" alt="ADA" width={32} height={32} />
            <div className="h-5 w-px bg-white/20" />
            <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
              Official Verification Record
            </span>
          </div>
          <h1 className="font-dm-serif text-3xl md:text-4xl text-white">
            Credential Verification
          </h1>
        </div>
      </section>

      {/* Status banner */}
      <div className={`${bannerColor} py-4`}>
        <div className="max-w-[1000px] mx-auto px-6 flex items-center justify-center gap-3">
          {bannerIcon}
          <span className="font-outfit font-bold text-white tracking-wide text-sm md:text-base">
            {overallStatus}
          </span>
        </div>
      </div>

      {/* Doula info + all credentials */}
      <section className="py-16 bg-white">
        <div className="max-w-[640px] mx-auto px-6">
          {/* Doula identity card */}
          <div className="border-2 border-ada-navy/10 rounded-2xl overflow-hidden mb-6">
            <div className="bg-ada-navy/[0.03] px-8 py-5 border-b border-ada-navy/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ada-purple/10 flex items-center justify-center">
                  <Image src="/images/ada-logo-white.svg" alt="ADA" width={20} height={20} className="opacity-50" />
                </div>
                <div>
                  <p className="font-outfit text-xs text-ada-navy/40 uppercase tracking-wider font-semibold">
                    Asian Doula Alliance
                  </p>
                  <p className="font-outfit text-sm text-ada-navy font-semibold">
                    Credential Verification
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-ada-navy/5">
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Holder</span>
                <span className="text-sm font-outfit font-semibold text-ada-navy">
                  {doulaInfo.full_name}
                  {doulaInfo.full_name_zh && (
                    <span className="text-ada-navy/40 font-normal ml-2">({doulaInfo.full_name_zh})</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Doula ID</span>
                <span className="text-sm font-mono text-ada-navy">{doulaInfo.doula_id_code}</span>
              </div>
            </div>
          </div>

          {/* Credentials list */}
          {creds.length === 0 ? (
            <p className="text-sm text-ada-navy/40 font-outfit text-center">No credentials on file for this doula.</p>
          ) : (
            <div className="space-y-4">
              {creds.map((cred) => {
                const isExpired = cred.expiration_date && new Date(cred.expiration_date) < new Date();
                const isCredRevoked = cred.status === 'revoked';
                const isCredSuspended = cred.status === 'suspended';
                const isCredActive = !isDoulaRevoked && !isDoulaSuspended && !isCredRevoked && !isCredSuspended && !isExpired;
                const latestCert = certs.find(c => c.certificate_type === cred.credential_type);

                const credStatusLabel = isDoulaRevoked ? 'Revoked' : isDoulaSuspended ? 'Suspended' : isCredRevoked ? 'Revoked' : isCredSuspended ? 'Suspended' : isExpired ? 'Expired' : 'Active';
                const credStatusColor = isCredActive ? 'bg-emerald-50 text-emerald-700' : (isExpired ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700');
                const credDotColor = isCredActive ? 'bg-emerald-500' : (isExpired ? 'bg-amber-500' : 'bg-red-500');

                return (
                  <div key={cred.credential_type} className="border-2 border-ada-navy/10 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-ada-navy/5">
                      <div className="flex justify-between items-center px-8 py-4">
                        <span className="text-sm text-ada-navy/40 font-outfit">Credential</span>
                        <span className="text-sm font-outfit font-semibold text-ada-navy">
                          {CREDENTIAL_LABELS[cred.credential_type as CredentialType] || cred.credential_type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-8 py-4">
                        <span className="text-sm text-ada-navy/40 font-outfit">Status</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-outfit font-semibold ${credStatusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${credDotColor}`} />
                          {credStatusLabel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-8 py-4">
                        <span className="text-sm text-ada-navy/40 font-outfit">Valid Through</span>
                        <span className="text-sm font-outfit text-ada-navy">
                          {cred.expiration_date ? formatDate(cred.expiration_date) : 'Permanent'}
                        </span>
                      </div>
                      {latestCert && (
                        <div className="flex justify-between items-center px-8 py-4">
                          <span className="text-sm text-ada-navy/40 font-outfit">Certificate</span>
                          <span className="text-sm font-mono text-ada-navy">{latestCert.certificate_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 bg-ada-navy/[0.03] rounded-xl px-6 py-4 border border-ada-navy/10">
            <p className="text-xs text-ada-navy/30 font-outfit text-center">
              This record was retrieved from the Asian Doula Alliance official certification registry.
              <br />
              Verification records are retrieved in real-time from the ADA registry.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 text-sm text-ada-navy/60 font-outfit hover:text-ada-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Verify Another Credential
            </Link>
            <Link
              href="/support/contact"
              className="text-sm text-ada-purple font-outfit hover:underline"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/(public)/verify/[code]/page.tsx
git commit -m "feat: rewrite verify page to show all credentials per doula"
```

---

### Task 5: Portal page — show certificate history with superseded badges

**Files:**
- Modify: `src/app/(public)/portal/page.tsx`

The portal currently shows certificates as a flat list. Update to show superseded certificates with a gray badge, and ensure all are downloadable.

- [ ] **Step 1: Update the Certificate interface to include status**

In the `Certificate` interface (around line 30), add `status`:

```typescript
interface Certificate {
  id: string;
  certificate_number: string;
  certificate_type: string;
  issued_date: string;
  pdf_url: string | null;
  status: string;
}
```

Also update the `ExamResult` interface if `certificate_type` is missing (check current code).

- [ ] **Step 2: Update the certificates section in the dashboard**

Find the certificates section (around line 601). Replace the certificates display with status-aware rendering.

For each certificate, show a "Superseded" badge if `cert.status === 'superseded'`, and dim the row. Keep the download button for all certificates (doulas may need old PDFs for records).

Replace the certificate list JSX with:

```typescript
{certificates.map((cert) => (
  <div key={cert.id} className={`flex items-center justify-between border border-gray-200 rounded-xl px-6 py-4 ${cert.status === 'superseded' ? 'opacity-50' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-ada-purple/10 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-ada-purple/60" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-outfit font-semibold text-ada-navy text-sm">{cert.certificate_number}</p>
          {cert.status === 'superseded' && (
            <span className="text-[10px] font-outfit font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
              {lang === 'zh' ? '已替代' : 'Superseded'}
            </span>
          )}
        </div>
        <p className="text-xs text-ada-navy/40 font-outfit">{labels.issued} {formatDate(cert.issued_date, lang)}</p>
      </div>
    </div>
    {cert.pdf_url ? (
      <a
        href={cert.pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ada-purple text-white text-xs font-outfit font-semibold hover:bg-ada-purple-hover transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> {labels.download}
      </a>
    ) : (
      <span className="text-xs text-ada-navy/20 font-outfit">{labels.noPdf}</span>
    )}
  </div>
))}
```

- [ ] **Step 3: Add i18n for "Superseded"**

In the translations object, add:
- English: `superseded: 'Superseded'`
- Chinese: `superseded: '已替代'`

- [ ] **Step 4: Update the API verify endpoint to return certificate_type and status**

Check if the `/api/portal/verify` route returns `certificate_type` and `status` for certificates. If not, update the select query.

- [ ] **Step 5: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/app/(public)/portal/page.tsx
git commit -m "feat: portal shows certificate history with superseded badges"
```

---

### Task 6: Final verification, push, run migrations

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 2: Review all changes**

Run: `git diff origin/main --stat` and `git log origin/main..HEAD --oneline`

- [ ] **Step 3: Push**

```bash
git push origin main
```

- [ ] **Step 4: Run migrations 012 and 013 in Supabase SQL Editor**

Go to Supabase SQL Editor for project `sztqpeebrvgualvegbxd`.

Run migration 012:
```sql
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_status_check;
ALTER TABLE certificates ADD CONSTRAINT certificates_status_check 
  CHECK (status IN ('active', 'superseded', 'revoked'));
```

Run migration 013:
```sql
INSERT INTO doula_credentials (doula_id, credential_type, status, certification_date, expiration_date)
SELECT d.id, 'postpartum', 'active', d.certification_date, d.expiration_date
FROM doulas d
LEFT JOIN doula_credentials dc ON dc.doula_id = d.id AND dc.credential_type = 'postpartum'
WHERE dc.id IS NULL
  AND d.certification_date IS NOT NULL;
```

Verify:
```sql
-- Should return 0 (no doulas with cert dates but no credential)
SELECT count(*) FROM doulas d
LEFT JOIN doula_credentials dc ON dc.doula_id = d.id
WHERE dc.id IS NULL AND d.certification_date IS NOT NULL;
```

- [ ] **Step 5: Verify deployed site**

Check: `curl -s -o /dev/null -w "%{http_code}" https://www.asiandoula.org/verify/test`
Expected: 200 (not found page, but 200 HTTP)

Check: `curl -s -o /dev/null -w "%{http_code}" https://www.asiandoula.org/portal`
Expected: 200
