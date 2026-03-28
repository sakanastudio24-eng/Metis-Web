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
      <div className={`auth-card ${styles.flowCard} ${styles.successCard}`}>
        <CheckCircle2 size={44} className={styles.successIcon} />
        <span className="auth-eyebrow">{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{email ? copy.readyForEmail(email) : copy.readyForYou}</p>

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
      </div>
    </main>
  );
}
