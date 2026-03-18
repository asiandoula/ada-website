import { AdminSidebar } from '@/components/admin/sidebar';

export default function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-zinc-100 p-8">{children}</main>
    </div>
  );
}
