"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { LoaderCircle } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import { bootstrapAccountData } from "@/lib/account-data";
import { getDefaultAuthCompletionPath, isDeletedUser, isSafeAuthNextPath } from "@/lib/auth";
import { getAuthSource } from "@/lib/contracts/communication";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type AuthCallbackScreenProps = {
  code: string | null;
  error: string | null;
  errorDescription: string | null;
  extensionId: string | null;
  intent: string | null;
  nextPath: string | null;
  source: string | null;
  magicLinkMode: string | null;
};

export function AuthCallbackScreen({
  code,
  error,
  errorDescription,
  extensionId,
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
      if (extensionId) {
        failure.searchParams.set("extensionId", extensionId);
      }
      if (magicLinkMode === "local") {
        failure.searchParams.set("magic_link", "local");
      }
      if (intent) {
        failure.searchParams.set("intent", intent);
      }

      failure.searchParams.set("error", errorCode);

      if (message) {
        failure.searchParams.set("message", message);
      }

      return `${failure.pathname}${failure.search}`;
    }

    async function completeCallback() {
      console.info("[Metis bridge] auth callback started", {
        source: parsedSource,
        extensionId,
        nextPath,
        redirectPath,
        currentPath: `${window.location.pathname}${window.location.search}`,
      });

      if (error) {
        console.warn("[Metis bridge] auth callback received provider error", {
          error,
          errorDescription,
        });
        router.replace(buildFailureHref(error === "access_denied" ? "oauth_cancelled" : "callback_failed", errorDescription));
        return;
      }

      if (!code) {
        console.warn("[Metis bridge] auth callback missing code");
        router.replace(buildFailureHref("callback_failed"));
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("[Metis bridge] auth callback session exchange failed", exchangeError);
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

      if (user) {
        await bootstrapAccountData(supabase, user);

        if (intent === "plus_beta") {
          const response = await fetch("/api/account/plus-beta", {
            method: "POST",
          });

          if (!response.ok) {
            console.warn("[Metis bridge] plus beta enrollment did not complete during callback", {
              status: response.status,
            });
          } else {
            console.info("[Metis bridge] plus beta enrollment completed during callback");
          }
        }
      }

      const success = new URL(redirectPath, window.location.origin);
      if (parsedSource) {
        success.searchParams.set("source", parsedSource);
      }
      if (extensionId) {
        success.searchParams.set("extensionId", extensionId);
      }
      // Delete re-auth returns through the shared callback so the account
      // overlay can reopen in place instead of sending people to a second page.
      if (!parsedSource && redirectPath === "/account/settings" && intent === "delete-account") {
        success.searchParams.set("auth", "confirmed");
        success.searchParams.set("intent", "delete-account");
      }
      console.info("[Metis bridge] auth callback redirecting", {
        destination: `${success.pathname}${success.search}`,
      });
      router.replace(`${success.pathname}${success.search}`);
    }

    void completeCallback();
  }, [code, error, errorDescription, extensionId, intent, magicLinkMode, nextPath, router, source, supabase]);

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
