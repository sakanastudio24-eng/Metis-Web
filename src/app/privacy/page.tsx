import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <article className="legal-card">
        <span className="legal-eyebrow">Privacy</span>
        <h1>Metis privacy notes</h1>
        <p>
          Metis is being built to help teams understand frontend cost signals without turning the product into a data
          vacuum. The current website does not collect scan telemetry. The future extension and product flows will be
          documented in plain language before they are enabled.
        </p>
        <p>
          During this phase, any local examples or auth placeholders are there to explain the intended shape of the
          product. They are not wired to a live data pipeline yet.
        </p>
        <p>
          When the runtime products go live, this page should be updated to cover scan collection, storage windows,
          team access, and data deletion policy in detail.
        </p>
        <Link href="/">Back to Metis</Link>
      </article>
    </main>
  );
}
