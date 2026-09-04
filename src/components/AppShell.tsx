import clsx from "clsx";
import Link from "next/link";
import { NavMenu } from "@/components/NavMenu";

export function AppShell({
  children,
  ancho = "normal",
}: {
  children: React.ReactNode;
  /** El editor de capítulo necesita más aire que el resto de páginas. */
  ancho?: "normal" | "amplio";
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center gap-7 px-6 sm:px-10 py-[18px] border-b border-line">
        <Link href="/" className="font-serif font-semibold text-[19px] tracking-[0.01em] text-text">
          El&nbsp;Urbanista
        </Link>
        <span className="flex-1" />
        <NavMenu />
      </header>
      <main className="min-h-[calc(100vh-63px)]">
        <div
          className={clsx(
            "mx-auto px-6 sm:px-10 py-10 sm:py-11",
            ancho === "amplio" ? "max-w-6xl" : "max-w-3xl"
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
