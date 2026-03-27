import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <article className="legal-card">
        <span className="legal-eyebrow">Terms</span>
        <h1>Metis terms preview</h1>
        <p>
          This project is in an implementation phase. The site is here to explain the product clearly, not to suggest
          that every promised workflow is already shipping. Anything marked as beta, planned, or placeholder should be
          read literally.
        </p>
        <p>
          Once live auth, reports, and billing exist, this page should be expanded with subscription terms, acceptable
          use boundaries, and customer support expectations.
        </p>
        <p>The source code for this repository is released under the MIT license included at the repo root.</p>
        <Link href="/">Back to Metis</Link>
      </article>
    </main>
  );
}
