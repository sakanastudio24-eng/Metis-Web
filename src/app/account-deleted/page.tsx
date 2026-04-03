import Link from "next/link";

import { authCopy } from "@/content/authCopy";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Account deleted",
  description: "This Metis account is no longer active.",
});

export default function AccountDeletedPage() {
  const copy = authCopy.accountDeleted;

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-8 text-white shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
        <h1 className="font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{copy.title}</h1>
        <p className="mt-4 text-sm leading-7 text-white/70">{copy.body}</p>
        <p className="mt-4 text-sm leading-7 text-white/55">{copy.extensionNote}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#dc5e5e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c85151]"
          >
            {copy.homeLabel}
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white"
          >
            {copy.signInLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
