import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { CERT_TYPE_LABELS } from '@/lib/constants';
import type { CertificateType } from '@/lib/constants';

export default async function CertificatesPage() {
  const supabase = await createClient();

  const { data: certs } = await supabase
    .from('certificates')
    .select('*, doulas(full_name, doula_id_code)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Certificates</h1>
        <Link href="/admin/certificates/generate">
          <Button className="bg-ada-purple hover:bg-ada-purple/90">
            + Generate Certificate
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-3 font-medium">Doula</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Number</th>
              <th className="text-left p-3 font-medium">Issued</th>
              <th className="text-left p-3 font-medium">Expires</th>
              <th className="text-left p-3 font-medium">Verify Code</th>
              <th className="text-left p-3 font-medium">PDF</th>
            </tr>
          </thead>
          <tbody>
            {certs?.map((cert) => {
              const doula = cert.doulas as Record<string, string> | null;
              return (
                <tr key={cert.id} className="border-b hover:bg-zinc-50">
                  <td className="p-3">
                    {doula?.full_name}
                    <span className="text-xs text-muted-foreground ml-2 font-mono">
                      {doula?.doula_id_code}
                    </span>
                  </td>
                  <td className="p-3">
                    {CERT_TYPE_LABELS[cert.certificate_type as CertificateType]}
                  </td>
                  <td className="p-3 font-mono">{cert.certificate_number}</td>
                  <td className="p-3">{cert.issued_date}</td>
                  <td className="p-3">{cert.expiration_date}</td>
                  <td className="p-3 font-mono text-xs">{cert.verification_code}</td>
                  <td className="p-3">
                    {cert.pdf_url && (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        className="text-ada-cyan hover:underline"
                      >
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
            {(!certs || certs.length === 0) && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No certificates generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
