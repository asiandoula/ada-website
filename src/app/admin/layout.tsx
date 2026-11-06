// .ada-admin switches on the Registry Office theme (globals.css) for every
// admin page, the sign-in page included.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="ada-admin">{children}</div>;
}
