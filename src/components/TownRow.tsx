import Link from "next/link";

export function TownRow({
  href,
  nombre,
  meta,
}: {
  href: string;
  nombre: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-[18px] py-4 border-b border-line last:border-b-0 hover:bg-surface-hi"
    >
      <div>
        <div className="font-serif text-[16.5px]">{nombre}</div>
        <div className="text-[12.5px] text-text-faint font-mono">{meta}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} className="w-4 h-4 stroke-text-faint">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

export function NewTownRow({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center px-[18px] py-4 border-b border-line last:border-b-0 hover:bg-surface-hi"
    >
      <span className="text-violet-ink text-[13.5px]">+ Nuevo municipio</span>
    </Link>
  );
}
