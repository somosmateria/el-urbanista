import Link from "next/link";
import { signOutAction } from "@/app/login/actions";
import { NavMenu } from "@/components/NavMenu";

export function AppShell({
  titulo,
  children,
}: {
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-rail">
      <header className="border-b border-line px-8 py-4 flex items-center gap-4">
        <NavMenu />
        <Link href="/" className="font-medium text-[15px] text-text">
          El Urbanista
        </Link>
        {titulo && (
          <>
            <span className="text-line-strong">/</span>
            <span className="text-[14px] text-text-soft">{titulo}</span>
          </>
        )}
        <span className="flex-1" />
        <form action={signOutAction}>
          <button
            type="submit"
            className="font-mono text-[11px] text-text-faint hover:text-text-soft cursor-pointer"
          >
            Cerrar sesión
          </button>
        </form>
      </header>
      <main className="bg-bg min-h-[calc(100vh-57px)]">
        <div className="max-w-3xl mx-auto px-10 py-11">{children}</div>
      </main>
    </div>
  );
}
