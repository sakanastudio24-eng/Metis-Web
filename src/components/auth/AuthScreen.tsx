"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState, useTransition } from "react";

import { Github, LoaderCircle, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";

import { authCopy } from "@/content/authCopy";
import { getAuthCallbackUrl, getAuthErrorMessage, getSupabaseAuthErrorCode } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "@/components/auth/AuthFlow.module.css";

type AuthScreenProps = {
  mode: "sign-in" | "sign-up";
  initialError?: string | null;
  initialMessage?: string | null;
};

export function AuthScreen({ mode, initialError = null, initialMessage = null }: AuthScreenProps) {
  const copy = mode === "sign-in" ? authCopy.signIn : authCopy.signUp;
  const sharedCopy = authCopy.shared;
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const errorMessage = getAuthErrorMessage(initialError);

    if (initialMessage) {
      setMessage(initialMessage);
    } else if (errorMessage) {
      setMessage(errorMessage);
    }
  }, [initialError, initialMessage]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.getUser();

      if (!cancelled && data.user) {
        router.replace("/logged-in");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  function setFriendlyError(error: unknown, fallback: string) {
    const description = error instanceof Error && error.message ? error.message : fallback;
    setMessage(description);
    toast.error(description);
  }

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setFriendlyError(new Error(sharedCopy.missingCredentialsMessage), sharedCopy.missingCredentialsMessage);
      return;
    }

    startTransition(async () => {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          const errorCode = getSupabaseAuthErrorCode(error);
          const friendlyMessage = getAuthErrorMessage(errorCode) ?? sharedCopy.signInError;
          setFriendlyError(new Error(friendlyMessage), friendlyMessage);
          return;
        }

        router.replace("/logged-in");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (error) {
        setFriendlyError(error, sharedCopy.createAccountError);
        return;
      }

      await supabase.auth.signOut();

      const successMessage = sharedCopy.verificationMessage;
      setMessage(successMessage);
      toast.success(successMessage);
    });
  }

  async function handleOAuth(provider: "google" | "github") {
    setMessage(null);

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (error) {
        setFriendlyError(error, sharedCopy.providerLaunchError);
      }
    });
  }

  return (
    <main className="auth-shell">
      <div className={`auth-card ${styles.flowFrame}`}>
        <section className={`${styles.flowCard} ${styles.primaryPanel}`}>
          <div className={styles.headerBlock}>
            <span className="auth-eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
          </div>

          <div className={styles.providerGrid}>
            <button type="button" className={styles.providerButton} onClick={() => handleOAuth("google")} disabled={isPending}>
              <LogIn size={16} />
              {sharedCopy.googleLabel}
            </button>
            <button type="button" className={styles.providerButton} onClick={() => handleOAuth("github")} disabled={isPending}>
              <Github size={16} />
              {sharedCopy.githubLabel}
            </button>
          </div>

          <div className={styles.divider}>
            <span />
            <strong>{sharedCopy.emailDividerLabel}</strong>
            <span />
          </div>

          <form className={styles.form} onSubmit={handleEmailAuth}>
            <label className={styles.field}>
              <span>{sharedCopy.emailLabel}</span>
              <div className={styles.inputShell}>
                <Mail size={15} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={sharedCopy.emailPlaceholder}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>{sharedCopy.passwordLabel}</span>
              <div className={styles.inputShell}>
                <LogIn size={15} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={sharedCopy.passwordPlaceholder}
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                  minLength={8}
                  required
                />
              </div>
            </label>

            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending ? <LoaderCircle size={16} className={styles.spin} /> : null}
              {copy.submitLabel}
            </button>
          </form>

          {message ? <p className={styles.feedback}>{message}</p> : null}

          <div className="auth-actions">
            <Link href="/">{sharedCopy.backToSite}</Link>
            <Link href={copy.alternateHref}>{copy.alternateLabel}</Link>
          </div>
        </section>

        <aside className={styles.contextPanel}>
          <div className={styles.contextGlow} />
          <span className={styles.contextLabel}>{sharedCopy.stageLabel}</span>
          <h2>{copy.panelTitle}</h2>
          <p>{copy.panelBody}</p>

          <div className={styles.stepRail}>
            {copy.steps.map((step, index) => (
              <div key={step} className={styles.stepChip}>
                <strong>{index + 1}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className={styles.highlightList}>
            {copy.highlights.map((item) => (
              <div key={item} className={styles.highlightCard}>
                <span className={styles.highlightDot} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
