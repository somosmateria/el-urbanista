import Link from "next/link";

export function BackLink({ href, children = "Volver" }: { href: string; children?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-violet hover:text-violet-hover mb-8"
    >
      <span aria-hidden>←</span>
      {children}
    </Link>
  );
}
