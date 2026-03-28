"use client";

import { useEffect, useState, useTransition } from "react";

import { KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import AuthCard03 from "@/components/block/AuthCard/authcard-03/authcard";
import AuthCard07 from "@/components/block/AuthCard/authcard-07/authcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authCopy } from "@/content/authCopy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ResetPasswordScreen() {
  const copy = authCopy.resetPassword;
  const sharedCopy = authCopy.shared;
  const supabase = createSupabaseBrowserClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isReady, setIsReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      setHasRecoverySession(Boolean(data.user));
      setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  function setNotice(text: string, tone: "success" | "error") {
    setMessage(text);
    if (tone === "success") {
      toast.success(text);
      return;
    }

    toast.error(text);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!password || !confirmPassword) {
      setNotice(sharedCopy.missingCredentialsMessage, "error");
      return;
    }

    if (password !== confirmPassword) {
      setNotice(sharedCopy.passwordMismatchMessage, "error");
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setNotice(sharedCopy.resetPasswordError, "error");
        return;
      }

      toast.success(sharedCopy.resetPasswordSuccess);
      setIsComplete(true);
    });
  }

  if (!isReady) {
    return (
      <main className="auth-shell flex items-center justify-center">
        <AuthCard07
          badge={copy.eyebrow}
          title="Loading recovery"
          description="Checking your recovery session now."
          icon={<LoaderCircle className="h-7 w-7 animate-spin" />}
          primaryAction={{ href: "/sign-in", label: "Back to sign in" }}
        />
      </main>
    );
  }

  if (!hasRecoverySession && !isComplete) {
    return (
      <main className="auth-shell flex items-center justify-center">
        <AuthCard07
          badge={copy.eyebrow}
          title={copy.invalidTitle}
          description={copy.invalidBody}
          icon={<KeyRound className="h-7 w-7" />}
          primaryAction={{ href: "/forgot-password", label: "Request new link" }}
          secondaryAction={{ href: "/sign-in", label: "Back to sign in" }}
        />
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="auth-shell flex items-center justify-center">
        <AuthCard07
          badge={copy.eyebrow}
          title={copy.successTitle}
          description={copy.successBody}
          icon={<ShieldCheck className="h-7 w-7" />}
          primaryAction={{ href: "/sign-in", label: copy.successLabel }}
          secondaryAction={{ href: "/", label: sharedCopy.backToSite }}
        />
      </main>
    );
  }

  return (
    <main className="auth-shell flex items-center justify-center">
      <AuthCard03
        badge={copy.eyebrow}
        title={copy.title}
        description={copy.intro}
        footerPrompt="Need a new recovery email?"
        footerHref="/forgot-password"
        footerLabel="Request another link"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="reset-password" className="text-sm font-medium text-slate-700">
              {sharedCopy.passwordLabel}
            </label>
            <Input
              id="reset-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={sharedCopy.createPasswordPlaceholder}
              className="h-12 rounded-2xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reset-password-confirm" className="text-sm font-medium text-slate-700">
              {copy.passwordConfirmLabel}
            </label>
            <Input
              id="reset-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={copy.passwordConfirmPlaceholder}
              className="h-12 rounded-2xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {message ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {message}
            </div>
          ) : null}

          <Button type="submit" className="h-12 w-full rounded-2xl bg-[#dc5e5e] text-white hover:bg-[#c24a4a]" disabled={isPending}>
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {copy.submitLabel}
          </Button>
        </form>
      </AuthCard03>
    </main>
  );
}
