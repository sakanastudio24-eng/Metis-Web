import Link from "next/link";

type AuthPlaceholderProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthPlaceholder({ mode }: AuthPlaceholderProps) {
  const title = mode === "sign-in" ? "Sign in to Metis" : "Create your Metis account";
  const intro =
    mode === "sign-in"
      ? "This screen is ready for the real auth pass. For now, it shows the shape of the product entry flow without pretending the credentials layer is finished."
      : "This is the first stop for the future Google and email/password signup flow. The page is intentionally honest: the account system is planned, not switched on yet.";

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <span className="auth-eyebrow">{mode === "sign-in" ? "Protected access" : "Early access"}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className="auth-stack">
          <div>
            <strong>Planned providers</strong>
            <span>Google OAuth and email/password</span>
          </div>
          <div>
            <strong>Secret delivery</strong>
            <span>1Password runtime injection with strict env validation</span>
          </div>
          <div>
            <strong>Backend pairing</strong>
            <span>Next.js session layer with FastAPI-protected product routes</span>
          </div>
        </div>
        <div className="auth-actions">
          <Link href="/">Back to the site</Link>
          <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"}>
            {mode === "sign-in" ? "Need an account?" : "Already have access?"}
          </Link>
        </div>
      </div>
    </main>
  );
}
