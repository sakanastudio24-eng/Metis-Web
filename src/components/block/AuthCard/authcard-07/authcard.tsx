import type { ReactNode } from "react";

import Link from "next/link";

type AuthCard07Action = {
  href: string;
  label: string;
};

type AuthCard07Props = {
  badge: string;
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
  primaryAction: AuthCard07Action;
  secondaryAction?: AuthCard07Action;
};

export default function AuthCard07({
  badge,
  title,
  description,
  icon,
  children,
  primaryAction,
  secondaryAction,
}: AuthCard07Props) {
  return (
    <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#dc5e5e]/25 bg-[#dc5e5e]/12 text-[#ffb8b8] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        {icon}
      </div>

      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-[#dc5e5e]/30 bg-[#dc5e5e]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">
          {badge}
        </span>
        <h1 className="font-serif text-4xl leading-none tracking-[-0.04em] text-[#fff5f0]">{title}</h1>
        <p className="text-sm leading-6 text-white/65">{description}</p>
      </div>

      {children ? <div className="mt-6">{children}</div> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={primaryAction.href}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#dc5e5e] px-5 text-sm font-semibold text-white transition hover:bg-[#c24a4a]"
        >
          {primaryAction.label}
        </Link>
        {secondaryAction ? (
          <Link
            href={secondaryAction.href}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 px-5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            {secondaryAction.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
