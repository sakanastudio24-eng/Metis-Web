import Link from "next/link";
import { frontFacingCopy } from "@/content/frontFacingCopy";

export default function TermsPage() {
  const copy = frontFacingCopy.legal.terms;
  return (
    <main className="legal-shell">
      <article className="legal-card">
        <span className="legal-eyebrow">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Link href="/">{frontFacingCopy.legal.backLink}</Link>
      </article>
    </main>
  );
}
