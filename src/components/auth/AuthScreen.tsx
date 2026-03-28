"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { ArrowRight, Github, LoaderCircle, Mail, ShieldCheck, Sparkles } from "lucide-react";
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
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="space-y-3 px-1 text-metis-cream">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <ShieldCheck className="h-3.5 w-3.5" />
            {authCopy.shared.brandLabel}
          </span>
          <div className="space-y-1">
            <h2 className="font-serif text-4xl leading-none tracking-[-0.05em] text-white sm:text-5xl">
              Smaller access
            </h2>
            <p className="max-w-sm text-sm leading-6 text-white/72">
              Real provider auth, real email access, and a short setup step once you are in.
            </p>
          </div>
        </div>

        <AuthCard03
          badge={copy.eyebrow}
          title={copy.title}
          description={copy.intro}
          footerPrompt={copy.footerPrompt}
          footerHref={copy.alternateHref}
          footerLabel={copy.alternateLabel}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                disabled={isPending}
                onClick={() => handleOAuth("google")}
              >
                <FcGoogle className="h-5 w-5" />
                {sharedCopy.googleLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
              className="h-12 w-full rounded-2xl border-dashed border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
              disabled={isPending}
              onClick={handleMagicLink}
            >
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {sharedCopy.magicLinkLabel}
            </Button>

            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              {sharedCopy.emailDividerLabel}
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form className="space-y-4" onSubmit={handleEmailAuth}>
              <div className="space-y-2">
                <label htmlFor={`${mode}-email`} className="text-sm font-medium text-slate-700">
                  {sharedCopy.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id={`${mode}-email`}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={sharedCopy.emailPlaceholder}
                    autoComplete="email"
                    className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={`${mode}-password`} className="text-sm font-medium text-slate-700">
                    {sharedCopy.passwordLabel}
                  </label>
                  {mode === "sign-in" ? (
                    <Link href="/forgot-password" className="text-sm font-medium text-[#c44a4a] transition hover:text-[#a93b3b]">
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
                  className="h-12 rounded-2xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
                  minLength={8}
                  required
                />
              </div>

              {feedback ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                    feedback.tone === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
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

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Secure access via Supabase</span>
              <Link href="/" className="font-medium text-slate-700 transition hover:text-slate-950">
                {sharedCopy.backToSite}
              </Link>
            </div>
          </div>
        </AuthCard03>
      </div>
    </main>
  );
}
