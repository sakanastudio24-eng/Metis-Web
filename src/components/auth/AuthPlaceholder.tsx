import Link from "next/link";
import { frontFacingCopy } from "@/content/frontFacingCopy";

type AuthPlaceholderProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthPlaceholder({ mode }: AuthPlaceholderProps) {
  const copy = mode === "sign-in" ? frontFacingCopy.auth.signIn : frontFacingCopy.auth.signUp;

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <span className="auth-eyebrow">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        <div className="auth-stack">
          {frontFacingCopy.auth.stack.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
        <div className="auth-actions">
          <Link href="/">{frontFacingCopy.auth.backToSite}</Link>
          <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"}>
            {mode === "sign-in" ? frontFacingCopy.auth.needAccount : frontFacingCopy.auth.alreadyHaveAccess}
          </Link>
        </div>
      </div>
    </main>
  );
}
