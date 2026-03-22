import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/admin/stats-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CERT_TYPE_LABELS } from '@/lib/constants';
import type { CertificateType } from '@/lib/constants';

export default async function DashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const in90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Stats
  const { count: totalDoulas } = await supabase
    .from('doulas')
    .select('*', { count: 'exact', head: true });

  const { count: activeDoulas } = await supabase
    .from('doulas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: expiringDoulas } = await supabase
    .from('doulas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .lte('expiration_date', in90Days)
    .gte('expiration_date', today);

  const { count: totalCerts } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true });

  // Expiring soon (30/60/90 days) — detailed list
  const { data: expiringSoon } = await supabase
    .from('doulas')
    .select('id, doula_id_code, full_name, expiration_date, status')
    .eq('status', 'active')
    .lte('expiration_date', in90Days)
    .gte('expiration_date', today)
    .order('expiration_date', { ascending: true })
    .limit(20);

  // Overdue — active doulas with expired certification date
  const { data: overdue } = await supabase
    .from('doulas')
    .select('id, doula_id_code, full_name, expiration_date, status')
    .or(`and(status.eq.active,expiration_date.lt.${today})`)
    .order('expiration_date', { ascending: true })
    .limit(20);

  // Recent activity — latest exams + certs
  const { data: recentExams } = await supabase
    .from('exam_results')
    .select('id, exam_session, exam_date, overall_score, passed, created_at, doulas(full_name)')
    .eq('voided', false)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: recentCerts } = await supabase
    .from('certificates')
    .select('id, certificate_type, certificate_number, issued_date, created_at, status, doulas(full_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  function daysUntil(date: string) {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function daysAgo(date: string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Doulas" value={totalDoulas ?? 0} />
        <StatsCard title="Active Certified" value={activeDoulas ?? 0} />
        <StatsCard
          title="Expiring (90 days)"
          value={expiringDoulas ?? 0}
          description="Need renewal attention"
        />
        <StatsCard title="Certificates Issued" value={totalCerts ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expiring Soon (90 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {(!expiringSoon || expiringSoon.length === 0) ? (
              <p className="text-muted-foreground text-sm">No certifications expiring soon.</p>
            ) : (
              <div className="space-y-2">
                {expiringSoon.map((d) => {
                  const days = daysUntil(d.expiration_date!);
                  return (
                    <div key={d.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <Link href={`/admin/doulas/${d.id}`} className="text-ada-purple hover:underline text-sm font-medium">
                          {d.full_name}
                        </Link>
                        <span className="text-xs text-muted-foreground ml-2 font-mono">{d.doula_id_code}</span>
                      </div>
                      <Badge className={days <= 30 ? 'bg-red-100 text-red-800' : days <= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                        {days} days
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overdue — Expired, Not Renewed</CardTitle>
          </CardHeader>
          <CardContent>
            {(!overdue || overdue.length === 0) ? (
              <p className="text-muted-foreground text-sm">No overdue certifications.</p>
            ) : (
              <div className="space-y-2">
                {overdue.map((d) => {
                  const days = Math.abs(daysUntil(d.expiration_date!));
                  return (
                    <div key={d.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <Link href={`/admin/doulas/${d.id}`} className="text-ada-purple hover:underline text-sm font-medium">
                          {d.full_name}
                        </Link>
                        <span className="text-xs text-muted-foreground ml-2 font-mono">{d.doula_id_code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">
                          {days} days overdue
                        </Badge>
                        <Link href={`/admin/doulas/${d.id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            Renew
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCerts?.map((cert) => {
              const doula = cert.doulas as unknown as Record<string, string> | null;
              return (
                <div key={`cert-${cert.id}`} className="flex items-center gap-3 text-sm border-b pb-2">
                  <span className="text-lg">📜</span>
                  <div className="flex-1">
                    <span className="font-medium">{doula?.full_name}</span>
                    {' — '}
                    {cert.status === 'revoked' ? (
                      <span className="text-red-600">Certificate revoked</span>
                    ) : (
                      <span>
                        {CERT_TYPE_LABELS[cert.certificate_type as CertificateType]} issued
                      </span>
                    )}
                    <span className="text-muted-foreground ml-1 font-mono text-xs">{cert.certificate_number}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{daysAgo(cert.created_at)}</span>
                </div>
              );
            })}
            {recentExams?.map((exam) => {
              const doula = exam.doulas as unknown as Record<string, string> | null;
              return (
                <div key={`exam-${exam.id}`} className="flex items-center gap-3 text-sm border-b pb-2">
                  <span className="text-lg">📝</span>
                  <div className="flex-1">
                    <span className="font-medium">{doula?.full_name}</span>
                    {' — Exam '}
                    {exam.passed ? (
                      <span className="text-green-700">passed</span>
                    ) : (
                      <span className="text-red-600">not passed</span>
                    )}
                    {exam.overall_score && <span className="text-muted-foreground"> ({exam.overall_score})</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">{daysAgo(exam.created_at)}</span>
                </div>
              );
            })}
            {(!recentExams || recentExams.length === 0) && (!recentCerts || recentCerts.length === 0) && (
              <p className="text-muted-foreground text-sm">No recent activity.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
