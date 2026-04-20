import Link from "next/link";
import { frontFacingCopy } from "@/content/frontFacingCopy";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Privacy policy",
  description: "Read how Metis handles information provided through the website and auth flow.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const copy = frontFacingCopy.legal.privacy;
  return (
    <main className="min-h-screen bg-[#0c1623] px-6 py-16 text-white sm:px-10 sm:py-20">
      <article className="mx-auto w-full max-w-4xl">
        <span className="legal-eyebrow">{copy.eyebrow}</span>
        <h1 className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl">{copy.title}</h1>
        <p className="mt-4 text-sm leading-7 text-white/58">Last updated: {copy.lastUpdated}</p>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-white/78">{copy.intro}</p>

        <div className="mt-12 space-y-10">
          {copy.sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-white">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="max-w-3xl text-sm leading-7 text-white/76">
                  {paragraph}
                </p>
              ))}
              {"bullets" in section && section.bullets ? (
                <ul className="max-w-3xl space-y-2 pl-5 text-sm leading-7 text-white/76">
                  {section.bullets.map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {"trailing" in section && section.trailing ? <p className="max-w-3xl text-sm leading-7 text-white/76">{section.trailing}</p> : null}
            </section>
          ))}
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          {frontFacingCopy.legal.backLink}
        </Link>
      </article>
    </main>
  );
}
