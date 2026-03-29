"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { ArrowRight, CheckCircle2, LoaderCircle, LogOut, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { clearTemporaryAuthSession } from "@/lib/temp-auth-client";

type LoggedInStateProps = {
  email: string | null;
  isTemporary?: boolean;
};

type AnswersState = Record<string, string[]>;

export function LoggedInState({ email, isTemporary = false }: LoggedInStateProps) {
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
      const selected = current[questionId] ?? [];

      return {
        ...current,
        [questionId]: selected.includes(option)
          ? selected.filter((item) => item !== option)
          : [...selected, option],
      };
    });
  }

  function handleSignOut() {
    startTransition(async () => {
      if (isTemporary) {
        await clearTemporaryAuthSession();
      } else {
        await supabase.auth.signOut();
      }
      router.replace("/sign-in");
    });
  }

  return (
    <main className="auth-shell flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <div className="space-y-3 px-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </span>
          <h1 className="max-w-2xl font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{copy.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-white/72">{copy.panelBody}</p>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-2">
              <span className="inline-flex rounded-full border border-[#dc5e5e]/30 bg-[#dc5e5e]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">
                {email ? copy.readyForEmail(email) : copy.readyForYou}
              </span>
              {isTemporary ? (
                <p className="text-sm text-[#ffb8b8]">{copy.temporaryAccountBody}</p>
              ) : null}
              <p className="text-sm text-white/55">
                {answeredCount} of {copy.questions.length} sections answered
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/8"
              onClick={handleSignOut}
              disabled={isPending}
            >
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              {copy.signOutLabel}
            </Button>
          </div>

          {isComplete ? (
            <div className="space-y-6 py-6">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#dc5e5e]/25 bg-[#dc5e5e]/12 text-[#ffb8b8]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    {copy.completionEyebrow}
                  </span>
                  {isTemporary ? (
                    <p className="text-sm font-medium text-[#ffb8b8]">{copy.temporaryAccountLabel}</p>
                  ) : null}
                  <h2 className="font-serif text-3xl leading-none tracking-[-0.04em] text-[#fff5f0]">
                    {copy.completionTitle}
                  </h2>
                  <p className="mx-auto max-w-xl text-sm leading-6 text-white/62">{copy.completionBody}</p>
                </div>
              </div>

              <div className="grid gap-3 rounded-[28px] bg-white/5 p-4">
                {copy.questions.map((question) => (
                  <div key={question.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
                    <p className="text-sm font-semibold text-white">{question.title}</p>
                    <p className="mt-1 text-sm text-white/55">
                      {answers[question.id].length > 0 ? answers[question.id].join(", ") : "Skipped"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/account"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 px-5 text-sm font-semibold text-white/78 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Open account
                </Link>
                <Button
                  type="button"
                  className="rounded-full bg-[#dc5e5e] px-5 text-white hover:bg-[#c24a4a]"
                  onClick={handleSignOut}
                  disabled={isPending}
                >
                  {copy.signOutLabel}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 py-6">
              {copy.questions.map((question) => (
                <article key={question.id} className="rounded-[28px] border border-white/10 bg-white/4 p-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-white">{question.title}</h2>
                    <p className="text-sm text-white/50">{question.helper}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {question.options.map((option) => {
                      const selected = answers[question.id].includes(option);

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => toggleAnswer(question.id, option)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            selected
                              ? "border-[#dc5e5e] bg-[#dc5e5e] text-white"
                              : "border-white/12 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/8 hover:text-white"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}

              <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/8"
                  onClick={() => router.replace("/")}
                >
                  {copy.skipLabel}
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-[#dc5e5e] px-5 text-white hover:bg-[#c24a4a]"
                  onClick={() => setIsComplete(true)}
                >
                  <ArrowRight className="h-4 w-4" />
                  {copy.finishLabel}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
