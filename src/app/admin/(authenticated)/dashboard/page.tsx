import { createClient } from '@/lib/supabase/server';
import { StatsCard } from '@/components/admin/stats-card';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { count: totalDoulas } = await supabase
    .from('doulas')
    .select('*', { count: 'exact', head: true });

  const { count: activeDoulas } = await supabase
    .from('doulas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'certified_active');

  const { count: expiringDoulas } = await supabase
    .from('doulas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'certified_active')
    .lte('expiration_date', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const { count: totalCerts } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Doulas" value={totalDoulas ?? 0} />
        <StatsCard title="Active Certified" value={activeDoulas ?? 0} />
        <StatsCard
          title="Expiring (90 days)"
          value={expiringDoulas ?? 0}
          description="Certifications expiring within 90 days"
        />
        <StatsCard title="Certificates Issued" value={totalCerts ?? 0} />
      </div>
    </div>
  );
}
