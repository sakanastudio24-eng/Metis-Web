import Link from "next/link";

import { frontFacingCopy } from "@/content/frontFacingCopy";
import { createPublicMetadata } from "@/lib/seo";

export const metadata = createPublicMetadata({
  title: "Support",
  description: "Get help with the Metis extension, account connection, and early-release support flows.",
  path: "/support",
});

export default function SupportPage() {
  const copy = frontFacingCopy.legal.support;

  return (
    <main className="min-h-screen bg-[#0c1623] px-6 py-16 text-white sm:px-10 sm:py-20">
      <article className="mx-auto w-full max-w-4xl">
        <span className="legal-eyebrow">{copy.eyebrow}</span>
        <h1 className="mt-5 font-serif text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl">{copy.title}</h1>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-white/78">{copy.intro}</p>

        <div className="mt-12 space-y-10">
          {copy.sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-white">{section.title}</h2>
              {"items" in section && section.items ? (
                <div className="space-y-5">
                  {section.items.map((item) => (
                    <div key={item.title} className="space-y-2">
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="max-w-3xl text-sm leading-7 text-white/76">{item.body}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              {"paragraphs" in section && section.paragraphs
                ? section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="max-w-3xl text-sm leading-7 text-white/76">
                      {paragraph}
                    </p>
                  ))
                : null}
            </section>
          ))}
        </div>

        <section className="mt-12 space-y-4">
          <h2 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-white">Useful links</h2>
          <div className="flex flex-wrap gap-3">
            {copy.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
