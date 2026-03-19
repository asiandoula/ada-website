import { SidebarNav } from '@/components/public/sidebar-nav';

const navItems = [
  { label: 'Steps to Certification', href: '/become-a-doula/steps-to-certification' },
  { label: 'Find a Doula Training', href: '/become-a-doula/find-a-doula-training' },
  { label: 'License and Exam', href: '/become-a-doula/license-and-exam' },
  { label: 'Code of Conduct', href: '/become-a-doula/code-of-conduct' },
  { label: 'Renew & Recertification', href: '/become-a-doula/renew-recertification' },
  { label: 'Doula Verification', href: '/become-a-doula/doula-verification' },
];

export default function BecomeADoulaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 pt-28 md:pt-32">
      <aside className="md:w-64 shrink-0">
        <h2 className="font-dm-serif text-xl mb-4 text-ada-navy">Become a Doula</h2>
        <SidebarNav items={navItems} />
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
