"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AlertTriangle, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authCopy } from "@/content/authCopy";
import { deriveAccountUsername, getMagicLinkCallbackUrl } from "@/lib/auth";
import { siteConfig } from "@/lib/site";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type DeleteAccountOverlayProps = {
  email: string | null;
  username: string;
  authConfirmed: boolean;
  onClose: () => void;
};

export function DeleteAccountOverlay({ email, username, authConfirmed, onClose }: DeleteAccountOverlayProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const copy = authCopy.deleteAccount;
  const [typedUsername, setTypedUsername] = useState("");
  const [typedDelete, setTypedDelete] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const normalizedUsername = deriveAccountUsername(username || email);
  const matchesConfirmation = typedDelete === "DELETE" && typedUsername.trim().toLowerCase() === normalizedUsername;

  function setError(message: string) {
    setFeedback(message);
    toast.error(message);
  }

  function startDeleteReauth() {
    if (!email || !matchesConfirmation) {
      setError(copy.mismatchError);
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const redirectUrl = new URL(getMagicLinkCallbackUrl("/account/security"));
      redirectUrl.pathname = "/auth/callback";
      redirectUrl.searchParams.set("next", "/account");
      redirectUrl.searchParams.set("intent", "delete-account");
      redirectUrl.searchParams.set("section", "settings");

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl.toString(),
        },
      });

      if (error) {
        setError(copy.reauthError);
        return;
      }

      toast.success(copy.reauthPending);
    });
  }

  function deleteAccount() {
    if (!matchesConfirmation) {
      setError(copy.mismatchError);
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError(copy.deleteError);
        return;
      }

      const response = await fetch(`${siteConfig.apiBaseUrl}/v1/account/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          confirmationText: typedDelete,
          username: typedUsername.trim().toLowerCase(),
        }),
      });

      if (!response.ok) {
        setError(copy.deleteError);
        return;
      }

      toast.success(copy.deleteSuccess);
      await supabase.auth.signOut();
      router.replace("/account-deleted");
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close delete account overlay"
        className="fixed inset-0 z-40 bg-[rgba(2,4,8,0.72)] backdrop-blur-[10px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <div className="space-y-3 px-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dc5e5e]/20 bg-[#dc5e5e]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">
            <AlertTriangle className="h-3.5 w-3.5" />
            {copy.eyebrow}
          </span>
          <h1 className="font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{copy.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-white/70">{copy.subtitle}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="space-y-4 rounded-[30px] border border-[#dc5e5e]/20 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb8b8]">This will</p>
            <div className="mt-4 grid gap-3">
              {copy.checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#ffb8b8]" />
                  <p className="text-sm text-white/82">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-[22px] border border-white/10 bg-white/5 p-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{copy.usernameLabel}</label>
              <input
                value={typedUsername}
                onChange={(event) => setTypedUsername(event.target.value)}
                placeholder={normalizedUsername}
                className="h-11 w-full rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 text-sm text-white outline-none transition focus:border-[#dc5e5e]/40"
              />
              <p className="text-sm leading-6 text-white/55">{copy.usernameHint(normalizedUsername)}</p>

              <label className="block pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{copy.confirmLabel}</label>
              <input
                value={typedDelete}
                onChange={(event) => setTypedDelete(event.target.value)}
                placeholder="DELETE"
                className="h-11 w-full rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 text-sm text-white outline-none transition focus:border-[#dc5e5e]/40"
              />
              <p className="text-sm leading-6 text-white/55">{copy.confirmHint}</p>
            </div>
            </section>

            <aside className="space-y-4 rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur sm:p-8">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dc5e5e]/10 text-[#ffb8b8]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{copy.reauthTitle}</p>
                  <p className="mt-1 text-sm leading-6 text-white/72">{copy.reauthBody}</p>
                </div>
              </div>
            </div>

            {feedback ? (
              <div className="rounded-[22px] border border-[#dc5e5e]/25 bg-[#dc5e5e]/10 px-4 py-3 text-sm text-[#ffb8b8]">{feedback}</div>
            ) : null}

            {authConfirmed ? (
              <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                {copy.reauthReady}
              </div>
            ) : null}

            {!authConfirmed ? (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full border-[#dc5e5e]/25 bg-[#dc5e5e]/10 text-[#ffb8b8] hover:bg-[#dc5e5e]/14 hover:text-white"
                disabled={isPending || !matchesConfirmation || !email}
                onClick={startDeleteReauth}
              >
                {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {copy.reauthCta}
              </Button>
            ) : (
              <Button
                type="button"
                variant="destructive"
                className="w-full rounded-full"
                disabled={isPending || !matchesConfirmation}
                onClick={deleteAccount}
              >
                {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                {copy.finalCta}
              </Button>
            )}

              <Button type="button" variant="ghost" className="w-full rounded-full text-white/70 hover:text-white" onClick={onClose}>
                {copy.cancelLabel}
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
