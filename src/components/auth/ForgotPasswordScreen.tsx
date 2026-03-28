"use client";

import { useState, useTransition } from "react";

import { LoaderCircle, Mail, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import AuthCard07 from "@/components/block/AuthCard/authcard-07/authcard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authCopy } from "@/content/authCopy";
import { getAuthCallbackUrl } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ForgotPasswordScreen() {
  const copy = authCopy.forgotPassword;
  const sharedCopy = authCopy.shared;
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

    if (!email) {
      setNotice(sharedCopy.missingEmailMessage, "error");
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthCallbackUrl(window.location.origin, "/reset-password"),
      });

      if (error) {
        setNotice(sharedCopy.resetRequestError, "error");
        return;
      }

      setSentTo(email);
      setNotice(sharedCopy.resetRequestSuccess, "success");
    });
  }

  if (sentTo) {
    return (
      <main className="auth-shell flex items-center justify-center">
        <AuthCard07
          badge={copy.eyebrow}
          title={copy.successTitle}
          description={copy.successBody(sentTo)}
          icon={<Mail className="h-7 w-7" />}
          primaryAction={{ href: "/sign-in", label: copy.backLabel }}
          secondaryAction={{ href: "/", label: sharedCopy.backToSite }}
        />
      </main>
    );
  }

  return (
    <main className="auth-shell flex items-center justify-center">
      <AuthCard07
        badge={copy.eyebrow}
        title={copy.title}
        description={copy.intro}
        icon={<ShieldAlert className="h-7 w-7" />}
        primaryAction={{ href: "/sign-in", label: copy.backLabel }}
        secondaryAction={{ href: "/", label: sharedCopy.backToSite }}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="forgot-password-email" className="text-sm font-medium text-slate-700">
              {sharedCopy.emailLabel}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="forgot-password-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={sharedCopy.emailPlaceholder}
                className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-slate-900 placeholder:text-slate-400"
              />
            </div>
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
      </AuthCard07>
    </main>
  );
}
