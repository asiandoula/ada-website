'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CERT_TYPE_LABELS, CERTIFICATE_TYPES } from '@/lib/constants';
// CertificateType used implicitly in CERT_TYPE_LABELS lookup

export default function CertificatesPage() {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [certs, setCerts] = useState<Record<string, any>[]>([]);

  async function loadCerts() {
    const { data } = await supabase
      .from('certificates')
      .select('*, doulas(full_name, doula_id_code)')
      .order('created_at', { ascending: false })
      .limit(200);
    setCerts(data ?? []);
  }

  useEffect(() => {
    loadCerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function CertTable({ items }: { items: typeof certs }) {
    if (items.length === 0) {
      return (
        <p className="p-8 text-center text-muted-foreground">
          No certificates in this category.
        </p>
      );
    }
    return (
      <table className="w-full text-sm min-w-[700px]">
        <thead className="border-b bg-zinc-50">
          <tr>
            <th className="text-left p-2 pl-3 font-medium">Doula</th>
            <th className="text-left p-2 font-medium">Number</th>
            <th className="text-left p-2 font-medium whitespace-nowrap">Issued</th>
            <th className="text-left p-2 font-medium whitespace-nowrap">Expires</th>
            <th className="text-left p-2 font-medium">Status</th>
            <th className="text-left p-2 font-medium">Verify</th>
            <th className="text-left p-2 pr-3 font-medium">PDF</th>
          </tr>
        </thead>
        <tbody>
          {items.map((cert) => {
            const doula = cert.doulas as Record<string, string> | null;
            return (
              <tr key={cert.id} className={`border-b hover:bg-zinc-50 ${cert.status === 'revoked' ? 'opacity-50' : ''}`}>
                <td className="p-2 pl-3">
                  <Link href={`/admin/doulas/${cert.doula_id}`} className="text-ada-purple hover:underline text-sm">
                    {doula?.full_name}
                  </Link>
                  <span className="text-xs text-muted-foreground ml-1 font-mono">
                    {doula?.doula_id_code}
                  </span>
                </td>
                <td className="p-2 font-mono text-xs">{cert.certificate_number}</td>
                <td className="p-2 whitespace-nowrap">{cert.issued_date}</td>
                <td className="p-2 whitespace-nowrap">{cert.expiration_date ?? 'Permanent'}</td>
                <td className="p-2">
                  {cert.status === 'revoked' ? (
                    <Badge className="bg-red-100 text-red-800 text-xs">Revoked</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                  )}
                </td>
                <td className="p-2 font-mono text-xs">{cert.verification_code}</td>
                <td className="p-2 pr-3">
                  {cert.pdf_url ? (
                    <a href={cert.pdf_url} target="_blank" className="text-cyan-500 hover:underline text-xs">
                      PDF
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

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

      <Tabs defaultValue="all" className="bg-white rounded-lg border overflow-hidden">
        <TabsList className="border-b w-full justify-start rounded-none bg-zinc-50 p-0 h-auto flex flex-row flex-wrap gap-0">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-ada-purple px-4 py-2 text-sm">
            All ({certs.length})
          </TabsTrigger>
          {CERTIFICATE_TYPES.map((type) => {
            const count = certs.filter((c) => c.certificate_type === type).length;
            if (count === 0) return null;
            return (
              <TabsTrigger key={type} value={type} className="rounded-none border-b-2 border-transparent data-[state=active]:border-ada-purple px-4 py-2 text-sm">
                {CERT_TYPE_LABELS[type].replace('ADA ', '').replace(' Certificate', '').replace('American Red Cross ', '')} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="overflow-x-auto">
          <TabsContent value="all" className="mt-0">
            <CertTable items={certs} />
          </TabsContent>
          {CERTIFICATE_TYPES.map((type) => (
            <TabsContent key={type} value={type} className="mt-0">
              <CertTable items={certs.filter((c) => c.certificate_type === type)} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
