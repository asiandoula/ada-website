import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { createClient } from '@/lib/supabase/server';
import { isAllowedAdminEmail } from '@/lib/auth/access';

// Defense in depth: these pages read data with the service-role key (bypassing
// RLS), so they must not rely solely on the middleware allowlist. Re-verify the
// caller here before rendering any admin surface.
export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAllowedAdminEmail(user?.email)) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-zinc-100 p-8">{children}</main>
    </div>
  );
}
