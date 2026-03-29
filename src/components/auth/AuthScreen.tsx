"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { ArrowRight, Github, LoaderCircle, Mail, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import AuthCard03 from "@/components/block/AuthCard/authcard-03/authcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authCopy } from "@/content/authCopy";
import { getAuthCallbackUrl, getAuthErrorMessage, getSupabaseAuthErrorCode } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthScreenProps = {
  mode: "sign-in" | "sign-up";
  initialError?: string | null;
  initialMessage?: string | null;
};

type FeedbackTone = "success" | "error";

type FeedbackState = {
  tone: FeedbackTone;
  text: string;
} | null;

export function AuthScreen({ mode, initialError = null, initialMessage = null }: AuthScreenProps) {
  const copy = mode === "sign-in" ? authCopy.signIn : authCopy.signUp;
  const sharedCopy = authCopy.shared;
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    const errorMessage = getAuthErrorMessage(initialError);

    if (initialMessage) {
      setFeedback({ tone: "success", text: initialMessage });
      return;
    }

    if (errorMessage) {
      setFeedback({ tone: "error", text: errorMessage });
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

  function setNotice(text: string, tone: FeedbackTone) {
    setFeedback({ text, tone });

    if (tone === "success") {
      toast.success(text);
      return;
    }

    toast.error(text);
  }

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!email || !password) {
      setNotice(sharedCopy.missingCredentialsMessage, "error");
      return;
    }

    startTransition(async () => {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          const errorCode = getSupabaseAuthErrorCode(error);
          setNotice(getAuthErrorMessage(errorCode) ?? sharedCopy.signInError, "error");
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
        setNotice(sharedCopy.createAccountError, "error");
        return;
      }

      await supabase.auth.signOut();
      router.replace(`/verify?email=${encodeURIComponent(email)}`);
    });
  }

  function handleOAuth(provider: "google" | "github") {
    setFeedback(null);

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getAuthCallbackUrl(window.location.origin),
        },
      });

      if (error) {
        setNotice(sharedCopy.providerLaunchError, "error");
      }
    });
  }

  function handleMagicLink() {
    setFeedback(null);

    if (!email) {
      setNotice(sharedCopy.missingEmailMessage, "error");
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
        setNotice(sharedCopy.magicLinkError, "error");
        return;
      }

      setNotice(sharedCopy.magicLinkSuccess, "success");
    });
  }

  return (
    <main className="auth-shell flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <section className="space-y-6 px-1 text-metis-cream">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {authCopy.shared.brandLabel}
          </span>
          <div className="space-y-3">
            <h1 className="max-w-lg font-serif text-5xl leading-none tracking-[-0.05em] text-white sm:text-6xl">
              {sharedCopy.stageTitle}
            </h1>
            <p className="max-w-md text-sm leading-7 text-white/70">{sharedCopy.stageBody}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Protected access</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Google, GitHub, magic link, and email access in one compact entry flow.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 p-4">
              <div className="flex items-center gap-2 text-[#ffb8b8]">
                <Zap className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">V3 Auth</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Designed to move quickly from secure sign-on into onboarding, account, and security surfaces.
              </p>
            </div>
          </div>
        </section>

        <AuthCard03
          badge={copy.eyebrow}
          title={copy.title}
          description={copy.intro}
          footerPrompt={copy.footerPrompt}
          footerHref={copy.alternateHref}
          footerLabel={copy.alternateLabel}
        >
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
              <Link
                href="/sign-in"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "sign-in" ? "bg-[#dc5e5e] text-white" : "text-white/65 hover:text-white"
                }`}
              >
                {sharedCopy.signInTab}
              </Link>
              <Link
                href="/sign-up"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === "sign-up" ? "bg-[#dc5e5e] text-white" : "text-white/65 hover:text-white"
                }`}
              >
                {sharedCopy.signUpTab}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-white/12 bg-white/5 text-white hover:bg-white/8"
                disabled={isPending}
                onClick={() => handleOAuth("google")}
              >
                <FcGoogle className="h-5 w-5" />
                {sharedCopy.googleLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-white/12 bg-white/5 text-white hover:bg-white/8"
                disabled={isPending}
                onClick={() => handleOAuth("github")}
              >
                <Github className="h-4 w-4" />
                {sharedCopy.githubLabel}
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-2xl border-dashed border-white/14 bg-white/4 text-white/88 hover:bg-white/7"
              disabled={isPending}
              onClick={handleMagicLink}
            >
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {sharedCopy.magicLinkLabel}
            </Button>

            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
              <span className="h-px flex-1 bg-white/10" />
              {sharedCopy.emailDividerLabel}
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form className="space-y-4" onSubmit={handleEmailAuth}>
              <div className="space-y-2">
                <label htmlFor={`${mode}-email`} className="text-sm font-medium text-white/70">
                  {sharedCopy.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    id={`${mode}-email`}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={sharedCopy.emailPlaceholder}
                    autoComplete="email"
                    className="h-12 rounded-2xl border-white/12 bg-white/5 pl-11 text-white placeholder:text-white/25"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={`${mode}-password`} className="text-sm font-medium text-white/70">
                    {sharedCopy.passwordLabel}
                  </label>
                  {mode === "sign-in" ? (
                    <Link href="/forgot-password" className="text-sm font-medium text-[#ffb8b8] transition hover:text-white">
                      {sharedCopy.forgotPasswordLabel}
                    </Link>
                  ) : null}
                </div>
                <Input
                  id={`${mode}-password`}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={mode === "sign-in" ? sharedCopy.passwordPlaceholder : sharedCopy.createPasswordPlaceholder}
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                  className="h-12 rounded-2xl border-white/12 bg-white/5 text-white placeholder:text-white/25"
                  minLength={8}
                  required
                />
              </div>

              {feedback ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                    feedback.tone === "success"
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-red-400/30 bg-red-400/10 text-red-200"
                  }`}
                >
                  {feedback.text}
                </div>
              ) : null}

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-[#dc5e5e] text-white hover:bg-[#c24a4a]"
                disabled={isPending}
              >
                {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {copy.submitLabel}
              </Button>
            </form>

            <div className="flex items-center justify-between text-sm text-white/42">
              <span>{sharedCopy.legalBlurb}</span>
              <Link href="/" className="font-medium text-white/65 transition hover:text-white">
                {sharedCopy.backToSite}
              </Link>
            </div>
          </div>
        </AuthCard03>
      </div>
    </main>
  );
}
