"use client";

import { useRouter } from "next/navigation";

import { useTransition } from "react";

import Link from "next/link";

import { CheckCircle2, LoaderCircle, LogOut, Sparkles } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "@/components/auth/AuthFlow.module.css";

type LoggedInStateProps = {
  email: string | null;
};

export function LoggedInState({ email }: LoggedInStateProps) {
  const copy = authCopy.loggedIn;
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await supabase.auth.signOut();
      router.replace("/sign-in");
    });
  }

  return (
    <main className="auth-shell">
      <div className={`auth-card ${styles.flowFrame} ${styles.successFrame}`}>
        <section className={`${styles.flowCard} ${styles.successCard}`}>
          <div className={styles.successHero}>
            <div className={styles.successIconShell}>
              <CheckCircle2 size={48} className={styles.successIcon} />
            </div>
            <span className="auth-eyebrow">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{email ? copy.readyForEmail(email) : copy.readyForYou}</p>
          </div>

          <div className={styles.successPanel}>
            <div>
              <strong>{copy.panelTitle}</strong>
              <span>{copy.panelBody}</span>
            </div>
            <Sparkles size={18} />
          </div>

          <div className="auth-actions">
            <Link href="/">Back to the site</Link>
            <button type="button" onClick={handleSignOut} className={styles.providerButton} disabled={isPending}>
              {isPending ? <LoaderCircle size={16} className={styles.spin} /> : <LogOut size={16} />}
              {copy.signOutLabel}
            </button>
          </div>
        </section>

        <aside className={styles.contextPanel}>
          <div className={styles.contextGlow} />
          <span className={styles.contextLabel}>{copy.summaryTitle}</span>
          <h2>{copy.panelTitle}</h2>
          <p>{copy.panelBody}</p>

          <div className={styles.highlightList}>
            {copy.summaryItems.map((item) => (
              <div key={item.title} className={styles.highlightCard}>
                <span className={styles.highlightDot} />
                <div className={styles.summaryCopy}>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
