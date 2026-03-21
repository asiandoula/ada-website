# Doula Portal — Design Spec

> Single-page portal for certified doulas to view their profile, credentials, certificates, and exam results.

## Problem

Doulas have no way to access their certification records online. Admin can see everything, but doulas must contact ADA to check their status or get certificate PDFs.

## Solution

A single-page portal at `/portal` where doulas verify their identity (email + doula ID code) and see their complete certification profile.

## Authentication: Verification Code Login

No Supabase Auth account needed. Session-based, stateless.

**Flow:**
1. Doula visits `/portal`
2. Enters doula_id_code (required) + email OR phone number (one required)
3. API validates ID code + contact info match a record in `doulas` table
4. On success: returns doula data + credentials + exams + certificates
5. Frontend renders the full profile
6. No persistent session — data lives in client state only

**Why both options:** Some doulas only have a phone number on file, no email.

**Security:**
- Rate limiting on verification API (5 attempts per IP per hour)
- doula_id_code + (email OR phone) must both match the same record
- No sensitive data exposed beyond what the doula already knows
- Exam scores visible only to the doula (not on `/verify/[code]`)

## Page Structure

### `/portal` — Single Page with Two States

**State 1: Verification Form (not authenticated)**
- Clean centered form matching site design
- Doula ID Code field (required)
- Toggle: "Use Email" / "Use Phone Number" — shows one input at a time
- "Access My Profile" button
- Help text: "Your Doula ID Code is on your certification certificate (e.g., 25-80301)"
- Link to `/verify` for public certification verification

**State 2: Profile Dashboard (authenticated)**
- Doula name + ID code + status badge
- **Credentials section**: list of all credentials with status, dates, expiration
- **Certificates section**: list of issued certificates with PDF download links
- **Exam Results section**: scores by exam type, date, pass/fail
- "Log Out" button (clears state, returns to form)

## API

### `POST /api/portal/verify`

**Request (email):**
```json
{ "doula_id_code": "25-80301", "email": "linda@example.com" }
```

**Request (phone):**
```json
{ "doula_id_code": "25-80301", "phone": "6265551234" }
```

**Response (success):**
```json
{
  "doula": { "id", "full_name", "full_name_zh", "email", "status", "doula_id_code", "region", "languages", "certification_date", "expiration_date" },
  "credentials": [{ "credential_type", "status", "certification_date", "expiration_date" }],
  "certificates": [{ "id", "certificate_number", "issued_date", "pdf_url", "credential_type" }],
  "exam_results": [{ "exam_session", "exam_type", "score", "passed", "exam_date" }]
}
```

**Response (failure):**
```json
{ "error": "Invalid email or ID code." }
```

Uses service_role key (server-side only). Rate limited.

## Relationship to `/verify/[code]`

| Feature | `/verify/[code]` | `/portal` |
|---------|-----------------|-----------|
| Who uses it | Anyone (families, insurers) | Doula herself |
| Auth required | No | Email + ID code |
| Shows status | Yes | Yes |
| Shows cert details | Basic | Full |
| Shows exam scores | No | Yes |
| PDF download | No | Yes |
| Shows personal info | Name only | Full profile |

## Design

Follows existing site patterns:
- Hero: `bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20`
- Form: centered card with ADA purple CTA button
- Profile: sections with headings, cards for credentials/certs/exams
- Status badges: green (active), red (expired/revoked), yellow (under investigation)
- Responsive: single column on mobile, comfortable on desktop

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/(public)/portal/page.tsx` | New — portal page (client component) |
| `src/app/api/portal/verify/route.ts` | New — verification API |
| `src/app/sitemap.ts` | Add `/portal` |
| `src/components/public/header.tsx` | Add "My Portal" link to For Doulas dropdown |

## Out of Scope

- Password/account creation
- Profile editing (admin-only for now)
- Email notifications
- Persistent sessions / cookies
