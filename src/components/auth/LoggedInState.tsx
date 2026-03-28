"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMemo, useState, useTransition } from "react";

import { ArrowRight, CheckCircle2, LoaderCircle, LogOut } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import styles from "@/components/auth/AuthFlow.module.css";

type LoggedInStateProps = {
  email: string | null;
};

type AnswersState = Record<string, string[]>;

export function LoggedInState({ email }: LoggedInStateProps) {
  const copy = authCopy.loggedIn;
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<AnswersState>(() =>
    Object.fromEntries(copy.questions.map((question) => [question.id, []])),
  );

  const answeredCount = useMemo(
    () => Object.values(answers).filter((entry) => entry.length > 0).length,
    [answers],
  );

  function toggleAnswer(questionId: string, option: string) {
    setAnswers((current) => {
      const nextValues = current[questionId] ?? [];
      const hasOption = nextValues.includes(option);

      return {
        ...current,
        [questionId]: hasOption ? nextValues.filter((item) => item !== option) : [...nextValues, option],
      };
    });
  }

  function handleComplete() {
    setIsComplete(true);
  }

  function handleSignOut() {
    startTransition(async () => {
      await supabase.auth.signOut();
      router.replace("/sign-in");
    });
  }

  return (
    <main className={`auth-shell ${styles.surveyShell}`}>
      <div className={`auth-card ${styles.surveyBoard}`}>
        <section className={styles.surveyHero}>
          <div className={styles.surveyMeta}>
            <span className={styles.surveyTag}>{copy.eyebrow}</span>
            <span className={styles.signedInMeta}>{email ? copy.readyForEmail(email) : copy.readyForYou}</span>
          </div>
          <h1 className={styles.surveyTitle}>{copy.title}</h1>
          <p className={styles.surveyBody}>{copy.panelBody}</p>
        </section>

        <div className={styles.surveyLayout}>
          <aside className={styles.surveySidebar}>
            <div className={styles.surveySidebarCard}>
              <span className={styles.sidebarLabel}>{copy.summaryTitle}</span>
              <strong className={styles.sidebarValue}>{answeredCount}/{copy.questions.length}</strong>
              <p className={styles.sidebarBody}>questions answered so far</p>
            </div>

            <div className={styles.surveySummaryList}>
              {copy.summaryItems.map((item) => (
                <div key={item.title} className={styles.surveySummaryCard}>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className={styles.surveyContent}>
            {isComplete ? (
              <div className={styles.completionCard}>
                <div className={styles.completionIconShell}>
                  <CheckCircle2 size={46} className={styles.completionIcon} />
                </div>
                <span className={styles.completionEyebrow}>{copy.completionEyebrow}</span>
                <h2 className={styles.completionTitle}>{copy.completionTitle}</h2>
                <p className={styles.completionBody}>{copy.completionBody}</p>
                <div className={styles.completionAnswers}>
                  {copy.questions.map((question) => (
                    <div key={question.id} className={styles.completionAnswerRow}>
                      <strong>{question.title}</strong>
                      <span>{answers[question.id].length > 0 ? answers[question.id].join(", ") : "Skipped"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {copy.questions.map((question) => (
                  <article key={question.id} className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                      <h2>{question.title}</h2>
                      <p>{question.helper}</p>
                    </div>

                    <div className={styles.multiAnswerGrid}>
                      {question.options.map((option) => {
                        const isActive = answers[question.id].includes(option);

                        return (
                          <button
                            key={option}
                            type="button"
                            className={`${styles.answerChip} ${isActive ? styles.answerChipActive : ""}`}
                            onClick={() => toggleAnswer(question.id, option)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </>
            )}

            <div className={styles.surveyActions}>
              {!isComplete ? (
                <>
                  <button type="button" className={styles.ghostButton} onClick={() => router.replace("/")}>
                    {copy.skipLabel}
                  </button>
                  <button type="button" className={styles.submitButton} onClick={handleComplete}>
                    <ArrowRight size={16} />
                    {copy.finishLabel}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/" className={styles.secondaryLink}>
                    Back to the site
                  </Link>
                  <button type="button" onClick={handleSignOut} className={styles.providerButton} disabled={isPending}>
                    {isPending ? <LoaderCircle size={16} className={styles.spin} /> : <LogOut size={16} />}
                    {copy.signOutLabel}
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
