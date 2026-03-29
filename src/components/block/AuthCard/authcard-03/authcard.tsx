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
    <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dc5e5e] text-lg font-semibold text-white shadow-[0_14px_30px_rgba(220,94,94,0.32)]">
          M
        </div>
        <div className="space-y-1">
          <span className="inline-flex rounded-full border border-[#dc5e5e]/30 bg-[#dc5e5e]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">
            {badge}
          </span>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">Metis Web</p>
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <h1 className="font-serif text-4xl leading-none tracking-[-0.04em] text-[#fff5f0]">{title}</h1>
        <p className="text-sm leading-6 text-white/65">{description}</p>
      </div>

      {children}

      <div className="mt-6 text-center text-sm text-white/45">
        {footerPrompt}{" "}
        <Link href={footerHref} className="font-semibold text-[#ffb8b8] transition hover:text-white">
          {footerLabel}
        </Link>
      </div>
    </div>
  );
}
