import Link from "next/link";
import clsx from "clsx";

export function DocCard({
  href,
  icon,
  name,
  desc,
  badge,
  variant = "normal",
}: {
  href?: string;
  icon: React.ReactNode;
  name: string;
  desc: string;
  badge: { label: string; tone: "soon" | "on" | "on-cyan" };
  variant?: "normal" | "hero" | "disabled";
}) {
  const content = (
    <div
      className={clsx(
        "relative rounded-xl border p-5 transition-colors",
        variant === "hero" &&
          "bg-violet-wash border-violet shadow-[0_0_0_1px_rgba(180,85,242,0.25)]",
        variant === "disabled" && "border-line bg-surface opacity-40",
        variant === "normal" &&
          "border-line bg-surface hover:border-line-strong hover:-translate-y-0.5"
      )}
    >
      {variant === "hero" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={2}
          className="absolute top-[20px] right-[18px] w-3.5 h-3.5 stroke-violet-ink"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      )}
      <div
        className={clsx(
          "w-[38px] h-[38px] rounded-md flex items-center justify-center",
          variant === "hero" ? "bg-violet/18" : "bg-white/5"
        )}
      >
        <div
          className={clsx(
            "w-[19px] h-[19px] [&>svg]:w-full [&>svg]:h-full [&>svg]:stroke-current",
            variant === "hero" ? "text-violet-ink" : "text-text-soft"
          )}
        >
          {icon}
        </div>
      </div>
      <div className="font-serif text-[17px] mt-3.5 mb-1.5">{name}</div>
      <div className="text-[12.5px] text-text-faint leading-relaxed mb-2.5">{desc}</div>
      <span
        className={clsx(
          "inline-block text-[10.5px] font-mono px-2.5 py-1 rounded-full",
          badge.tone === "soon" && "bg-white/[0.06] text-text-faint",
          badge.tone === "on" &&
            "bg-violet-wash text-violet-ink border border-violet/40",
          badge.tone === "on-cyan" &&
            "bg-cyan-wash text-cyan-ink border border-cyan/40"
        )}
      >
        {badge.label}
      </span>
    </div>
  );

  if (variant === "disabled" || !href) {
    return <div>{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}
