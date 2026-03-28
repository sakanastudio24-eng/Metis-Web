import type { ReactNode } from "react";

import Link from "next/link";

type AuthCard03Props = {
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
  footerPrompt: string;
  footerHref: string;
  footerLabel: string;
};

export default function AuthCard03({
  badge,
  title,
  description,
  children,
  footerPrompt,
  footerHref,
  footerLabel,
}: AuthCard03Props) {
  return (
    <div className="w-full max-w-md rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_28px_90px_rgba(7,11,18,0.18)] sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dc5e5e] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
          M
        </div>
        <div className="space-y-1">
          <span className="inline-flex rounded-full bg-[#fce8e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b93f3f]">
            {badge}
          </span>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Metis Web</p>
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <h1 className="font-serif text-4xl leading-none tracking-[-0.04em] text-slate-950">{title}</h1>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      {children}

      <div className="mt-6 text-center text-sm text-slate-500">
        {footerPrompt}{" "}
        <Link href={footerHref} className="font-semibold text-[#c44a4a] transition hover:text-[#a93b3b]">
          {footerLabel}
        </Link>
      </div>
    </div>
  );
}
