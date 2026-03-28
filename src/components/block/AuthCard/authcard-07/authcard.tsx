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
    <div className="w-full max-w-md rounded-[32px] border border-white/15 bg-white p-6 shadow-[0_26px_80px_rgba(7,11,18,0.18)] sm:p-8">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e8] text-[#c44848] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        {icon}
      </div>

      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-[#fce8e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b93f3f]">
          {badge}
        </span>
        <h1 className="font-serif text-4xl leading-none tracking-[-0.04em] text-slate-950">{title}</h1>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
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
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {secondaryAction.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
