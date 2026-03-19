import { createClient } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CERT_TYPE_LABELS } from '@/lib/constants';
import type { CertificateType } from '@/lib/constants';

// Use service role to bypass RLS for public verification
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: cert } = await supabase
    .from('certificates')
    .select('*, doulas(full_name, full_name_zh, status)')
    .eq('verification_code', code)
    .single();

  if (!cert) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl font-bold mb-2">Certificate Not Found</h1>
            <p className="text-muted-foreground text-sm">
              The verification code &quot;{code}&quot; does not match any certificate
              in our system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const doula = cert.doulas as Record<string, string>;
  const isRevoked = cert.status === 'revoked';
  const isActive = !isRevoked && doula.status === 'certified_active';
  const isExpired = !isRevoked && doula.status === 'expired';

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ada-logo.svg"
              alt="ADA"
              className="h-12 mx-auto mb-3"
            />
            <h1 className="text-lg font-bold text-ada-navy">
              Certificate Verification
            </h1>
          </div>

          <div className="text-center mb-6">
            {isRevoked && (
              <Badge className="bg-red-100 text-red-800 text-sm px-4 py-1">
                ✗ Certificate Revoked
              </Badge>
            )}
            {isActive && (
              <Badge className="bg-green-100 text-green-800 text-sm px-4 py-1">
                ✓ Verified — Active
              </Badge>
            )}
            {isExpired && (
              <Badge className="bg-yellow-100 text-yellow-800 text-sm px-4 py-1">
                ⚠ Verified — Expired
              </Badge>
            )}
            {!isRevoked && !isActive && !isExpired && (
              <Badge className="bg-red-100 text-red-800 text-sm px-4 py-1">
                ✗ {doula.status.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </Badge>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">
                {doula.full_name}
                {doula.full_name_zh && ` (${doula.full_name_zh})`}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Certificate</span>
              <span className="font-medium">
                {CERT_TYPE_LABELS[cert.certificate_type as CertificateType]}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Number</span>
              <span className="font-mono">{cert.certificate_number}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Issued</span>
              <span>{cert.issued_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid Through</span>
              <span>{cert.expiration_date}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Asian Doula Alliance — asiandoula.org
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
