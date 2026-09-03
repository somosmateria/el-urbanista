import Link from "next/link";

export function BackLink({ href, children = "Volver" }: { href: string; children?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[12.5px] text-text-faint hover:text-text-soft mb-4"
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} className="w-[13px] h-[13px] stroke-current">
        <path d="M15 6l-6 6 6 6" />
      </svg>
      {children}
    </Link>
  );
}
