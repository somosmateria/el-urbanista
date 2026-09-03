import Link from "next/link";

export function AppShell({
  breadcrumb,
  children,
}: {
  breadcrumb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-rail">
      <header className="border-b border-line px-8 py-4 flex items-center gap-4">
        <Link href="/" className="font-serif text-lg text-text">
          El Urbanista
        </Link>
        <span className="font-mono text-[11.5px] text-text-faint">{breadcrumb}</span>
      </header>
      <main className="bg-bg min-h-[calc(100vh-57px)]">
        <div className="max-w-3xl mx-auto px-10 py-11">{children}</div>
      </main>
    </div>
  );
}
