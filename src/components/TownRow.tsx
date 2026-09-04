import Link from "next/link";

export function TownRow({
  href,
  n,
  nombre,
  nota,
  pct,
  meta,
}: {
  href: string;
  n?: string;
  nombre: string;
  nota?: string;
  pct: number;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-5 px-1.5 py-[17px] border-b border-line last:border-b-0 hover:bg-surface-hi"
    >
      {n && <span className="text-[11px] tracking-[0.12em] text-text-faint tabular-nums shrink-0">{n}</span>}
      <span className="shrink-0 min-w-[150px]">
        <span className="block font-serif font-semibold text-lg leading-[1.15]">{nombre}</span>
        {nota && (
          <span className="block text-[10px] tracking-[0.14em] uppercase text-text-faint mt-[3px]">{nota}</span>
        )}
      </span>
      <span className="hidden sm:flex items-center gap-3 flex-1 max-w-[280px]">
        <span className="flex-1 h-[2px] bg-line relative overflow-hidden">
          <span className="absolute inset-y-0 left-0 bg-violet" style={{ width: `${pct}%` }} />
        </span>
        <span className="text-[11.5px] tabular-nums text-text-soft w-[38px] text-right">{pct}%</span>
      </span>
      <span className="flex-1" />
      <span className="text-[10.5px] tracking-[0.14em] uppercase text-text-faint tabular-nums whitespace-nowrap">
        {meta}
      </span>
      <span className="text-violet text-[13px]">→</span>
    </Link>
  );
}

export function NewTownRow({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="block w-full text-left text-[11px] tracking-[0.16em] uppercase text-violet px-1.5 py-[17px] border-b border-line last:border-b-0 hover:bg-surface-hi"
    >
      + Nuevo municipio
    </Link>
  );
}
