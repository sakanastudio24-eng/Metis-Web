"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { ArrowRight, CheckCircle2, LoaderCircle, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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
      await supabase.auth.signOut();
      router.replace("/sign-in");
    });
  }

  return (
    <main className="min-h-screen bg-metis-onboarding px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <div className="space-y-2 px-1 text-white">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            {copy.eyebrow}
          </span>
          <h1 className="font-serif text-4xl leading-none tracking-[-0.05em] sm:text-5xl">{copy.title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-white/78">{copy.panelBody}</p>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-[0_28px_90px_rgba(7,11,18,0.24)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-[#fce8e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b93f3f]">
                {email ? copy.readyForEmail(email) : copy.readyForYou}
              </span>
              <p className="text-sm text-slate-600">
                {answeredCount} of {copy.questions.length} sections answered
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
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
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e8] text-[#c44848]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {copy.completionEyebrow}
                  </span>
                  <h2 className="font-serif text-3xl leading-none tracking-[-0.04em] text-slate-950">
                    {copy.completionTitle}
                  </h2>
                  <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">{copy.completionBody}</p>
                </div>
              </div>

              <div className="grid gap-3 rounded-[28px] bg-slate-50 p-4">
                {copy.questions.map((question) => (
                  <div key={question.id} className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{question.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {answers[question.id].length > 0 ? answers[question.id].join(", ") : "Skipped"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to the site
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
                <article key={question.id} className="rounded-[28px] border border-slate-200 p-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-slate-950">{question.title}</h2>
                    <p className="text-sm text-slate-500">{question.helper}</p>
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
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}

              <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-slate-200 text-slate-700 hover:bg-slate-50"
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
