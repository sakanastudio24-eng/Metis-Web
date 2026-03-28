"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState, useTransition } from "react";

import { ArrowRight, Github, KeyRound, LoaderCircle, Mail, Sparkles, WandSparkles } from "lucide-react";
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

  function showMessage(nextMessage: string, type: "success" | "error") {
    setMessage(nextMessage);

    if (type === "success") {
      toast.success(nextMessage);
      return;
    }

    toast.error(nextMessage);
  }

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!email || !password) {
      showMessage(sharedCopy.missingCredentialsMessage, "error");
      return;
    }

    startTransition(async () => {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          const errorCode = getSupabaseAuthErrorCode(error);
          showMessage(getAuthErrorMessage(errorCode) ?? sharedCopy.signInError, "error");
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
        showMessage(sharedCopy.createAccountError, "error");
        return;
      }

      await supabase.auth.signOut();
      showMessage(sharedCopy.verificationMessage, "success");
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
        showMessage(sharedCopy.providerLaunchError, "error");
      }
    });
  }

  async function handleMagicLink() {
    setMessage(null);

    if (!email) {
      showMessage(sharedCopy.missingEmailMessage, "error");
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (error) {
        showMessage(sharedCopy.magicLinkError, "error");
        return;
      }

      showMessage(sharedCopy.magicLinkSuccess, "success");
    });
  }

  const isSignIn = mode === "sign-in";

  return (
    <main className={`auth-shell ${styles.shell}`}>
      <div className={`auth-card ${styles.board}`}>
        <section className={styles.heroPanel}>
          <span className={styles.heroBadge}>{sharedCopy.brandLabel}</span>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}>{copy.eyebrow}</span>
            <h1 className={styles.heroTitle}>{copy.title}</h1>
            <p className={styles.heroBody}>{copy.panelBody}</p>
          </div>

          <div className={styles.stepRail}>
            {copy.steps.map((step, index) => (
              <div key={step} className={styles.stepChip}>
                <strong>{index + 1}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className={styles.spotlightGrid}>
            <div className={styles.spotlightCard}>
              <strong>{sharedCopy.accessCardTitle}</strong>
              <p>{sharedCopy.accessCardBody}</p>
            </div>
            <div className={styles.spotlightCard}>
              <strong>{sharedCopy.setupCardTitle}</strong>
              <p>{sharedCopy.setupCardBody}</p>
            </div>
            <div className={styles.spotlightCard}>
              <strong>{sharedCopy.trustCardTitle}</strong>
              <p>{sharedCopy.trustCardBody}</p>
            </div>
          </div>
        </section>

        <section className={styles.authPanel}>
          <div className={styles.switcher}>
            <span className={styles.switcherLabel}>{sharedCopy.switcherLabel}</span>
            <div className={styles.switcherRail}>
              <Link href="/sign-in" className={`${styles.switcherLink} ${isSignIn ? styles.switcherLinkActive : ""}`}>
                {sharedCopy.signInTab}
              </Link>
              <Link href="/sign-up" className={`${styles.switcherLink} ${!isSignIn ? styles.switcherLinkActive : ""}`}>
                {sharedCopy.signUpTab}
              </Link>
            </div>
          </div>

          <div className={styles.panelHeader}>
            <span className="auth-eyebrow">{copy.eyebrow}</span>
            <h2 className={styles.panelTitle}>{copy.title}</h2>
            <p className={styles.panelBody}>{copy.intro}</p>
          </div>

          <div className={styles.emailBlock}>
            <label className={styles.fieldLabel}>{sharedCopy.emailLabel}</label>
            <div className={styles.inputShell}>
              <Mail size={16} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={sharedCopy.emailPlaceholder}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.providerSection}>
            <span className={styles.providerLabel}>{sharedCopy.providerLabel}</span>
            <div className={styles.providerGrid}>
              <button type="button" className={styles.providerButton} onClick={() => handleOAuth("google")} disabled={isPending}>
                <Sparkles size={16} className={styles.providerIcon} />
                {sharedCopy.googleLabel}
              </button>
              <button type="button" className={styles.providerButton} onClick={() => handleOAuth("github")} disabled={isPending}>
                <Github size={16} className={styles.providerIcon} />
                {sharedCopy.githubLabel}
              </button>
            </div>
            <button type="button" className={styles.magicButton} onClick={handleMagicLink} disabled={isPending}>
              {isPending ? <LoaderCircle size={16} className={styles.spin} /> : <WandSparkles size={16} />}
              {sharedCopy.magicLinkLabel}
            </button>
          </div>

          <div className={styles.divider}>
            <span />
            <strong>{sharedCopy.emailDividerLabel}</strong>
            <span />
          </div>

          <form className={styles.form} onSubmit={handleEmailAuth}>
            <label className={styles.field}>
              <span>{sharedCopy.passwordLabel}</span>
              <div className={styles.inputShell}>
                <KeyRound size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={sharedCopy.passwordPlaceholder}
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  minLength={8}
                  required
                />
              </div>
            </label>

            <button type="submit" className={styles.submitButton} disabled={isPending}>
              {isPending ? <LoaderCircle size={16} className={styles.spin} /> : <ArrowRight size={16} />}
              {copy.submitLabel}
            </button>
          </form>

          {message ? <p className={styles.feedback}>{message}</p> : null}

          <div className={styles.footerActions}>
            <Link href="/" className={styles.secondaryLink}>
              {sharedCopy.backToSite}
            </Link>
            <Link href={copy.alternateHref} className={styles.secondaryLink}>
              {copy.alternateLabel}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
