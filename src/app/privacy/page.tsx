import Link from "next/link";
import { frontFacingCopy } from "@/content/frontFacingCopy";

export default function PrivacyPage() {
  const copy = frontFacingCopy.legal.privacy;
  return (
    <main className="legal-shell flex items-center justify-center">
      <article className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#101923]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur sm:p-8">
        <span className="legal-eyebrow">{copy.eyebrow}</span>
        <h1 className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl">{copy.title}</h1>
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            {paragraph}
          </p>
        ))}
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          {frontFacingCopy.legal.backLink}
        </Link>
      </article>
    </main>
  );
}
