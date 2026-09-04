import Link from "next/link";
import clsx from "clsx";

export function DocCard({
  href,
  n,
  name,
  desc,
  info,
  cta,
  disponible,
}: {
  href?: string;
  n: string;
  name: string;
  desc: string;
  info: string;
  cta?: string;
  disponible: boolean;
}) {
  const content = (
    <div
      className={clsx(
        "pageblock flex flex-col p-6 pb-[22px] border border-line rounded",
        disponible && href && "transition-colors hover:border-line-strong",
        !disponible && "opacity-45"
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-[11px] tracking-[0.14em] text-text-faint tabular-nums">({n})</span>
        <span className="tip" tabIndex={0}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="text-text-faint">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16.5v-5.5" />
            <path d="M12 8h.01" />
          </svg>
          <span className="tipb">{info}</span>
        </span>
      </div>
      <h3 className="font-serif font-semibold text-2xl leading-[1.15] mb-3">{name}</h3>
      <p className="text-[13.5px] leading-relaxed text-text-soft mb-5 min-h-[66px]">{desc}</p>
      {disponible ? (
        <span className="btn btn-primary self-start">{cta}</span>
      ) : (
        <span className="text-[10px] tracking-[0.16em] uppercase text-text-faint border-b border-line-strong pb-[3px] self-start">
          Próximamente
        </span>
      )}
    </div>
  );

  if (!disponible || !href) return content;
  return <Link href={href}>{content}</Link>;
}
