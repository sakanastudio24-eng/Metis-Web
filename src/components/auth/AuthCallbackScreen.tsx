"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { LoaderCircle } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import { getDefaultAuthCompletionPath, isDeletedUser, isSafeAuthNextPath } from "@/lib/auth";
import { getAuthSource } from "@/lib/contracts/communication";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthCallbackScreenProps = {
  code: string | null;
  error: string | null;
  errorDescription: string | null;
  intent: string | null;
  nextPath: string | null;
  source: string | null;
  magicLinkMode: string | null;
};

export function AuthCallbackScreen({
  code,
  error,
  errorDescription,
  intent,
  nextPath,
  source,
  magicLinkMode,
}: AuthCallbackScreenProps) {
  const router = useRouter();
  const copy = authCopy.callback;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    const parsedSource = getAuthSource(source);
    const redirectPath = isSafeAuthNextPath(nextPath) ? nextPath : getDefaultAuthCompletionPath(parsedSource);

    function buildFailureHref(errorCode: "oauth_cancelled" | "callback_failed", message?: string | null) {
      const failure = new URL("/sign-in", window.location.origin);

      if (parsedSource) {
        failure.searchParams.set("source", parsedSource);
      }
      if (magicLinkMode === "local") {
        failure.searchParams.set("magic_link", "local");
      }

      failure.searchParams.set("error", errorCode);

      if (message) {
        failure.searchParams.set("message", message);
      }

      return `${failure.pathname}${failure.search}`;
    }

    async function completeCallback() {
      if (error) {
        router.replace(buildFailureHref(error === "access_denied" ? "oauth_cancelled" : "callback_failed", errorDescription));
        return;
      }

      if (!code) {
        router.replace(buildFailureHref("callback_failed"));
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        router.replace(buildFailureHref("callback_failed"));
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isDeletedUser(user)) {
        await supabase.auth.signOut();
        router.replace("/account-deleted");
        return;
      }

      const success = new URL(redirectPath, window.location.origin);
      // Delete re-auth returns through the shared callback so the account
      // overlay can reopen in place instead of sending people to a second page.
      if (!parsedSource && redirectPath === "/account/settings" && intent === "delete-account") {
        success.searchParams.set("auth", "confirmed");
        success.searchParams.set("intent", "delete-account");
      }
      router.replace(`${success.pathname}${success.search}`);
    }

    void completeCallback();
  }, [code, error, errorDescription, intent, magicLinkMode, nextPath, router, source, supabase]);

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-8 text-white shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#dc5e5e]/30 bg-[#dc5e5e]/12">
          <LoaderCircle className="h-6 w-6 animate-spin text-[#dc5e5e]" />
        </div>
        <h1 className="mt-5 font-serif text-4xl leading-none tracking-[-0.05em] sm:text-5xl">{copy.title}</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">{copy.body}</p>
      </div>
    </div>
  );
}
