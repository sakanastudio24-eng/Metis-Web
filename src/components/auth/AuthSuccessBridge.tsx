"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CheckCircle2, ExternalLink, LoaderCircle } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import { METIS_AUTH_SUCCESS_PATH } from "@/lib/contracts/communication";
import type { BridgeAccountState } from "@/lib/contracts/communication";
import { sendBridgeSync, type BridgeSyncDebugInfo } from "@/lib/extension/sendBridgeSync";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type BridgeStatus = "posting" | "acknowledged" | "error";

type AuthSuccessBridgeProps = {
  account: BridgeAccountState;
  email: string | null;
  queryExtensionId: string | null;
};

export function AuthSuccessBridge({ account, email, queryExtensionId }: AuthSuccessBridgeProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const copy = authCopy.bridge;
  const [status, setStatus] = useState<BridgeStatus>("posting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<BridgeSyncDebugInfo | null>(null);

  const describeFailure = useCallback(
    (reason: string, detail?: string) => {
      switch (reason) {
        case "invalid_origin":
          return `${copy.invalidOriginBody}${detail ? ` ${detail}` : ""}`;
        case "invalid_extension_id":
          return `${copy.extensionUnavailableBody}${detail ? ` ${detail}` : ""}`;
        case "invalid_payload":
          return `${copy.invalidAccountBody}${detail ? ` ${detail}` : ""}`;
        case "unsupported_bridge_version":
          return `${copy.unknownFailureBody}${detail ? ` ${detail}` : ""}`;
        case "storage_failed":
          return `${copy.storageFailureBody}${detail ? ` ${detail}` : ""}`;
        case "extension_unavailable":
          return `${copy.extensionUnavailableBody}${detail ? ` ${detail}` : ""}`;
        default:
          return detail ?? copy.unknownFailureBody;
      }
    },
    [copy.extensionUnavailableBody, copy.invalidAccountBody, copy.invalidOriginBody, copy.storageFailureBody, copy.unknownFailureBody]
  );

  const closeOverlay = useCallback(() => {
    router.replace(METIS_AUTH_SUCCESS_PATH);
  }, [router]);

  const retryHref = queryExtensionId
    ? `/sign-in?source=extension&extensionId=${encodeURIComponent(queryExtensionId)}`
    : "/sign-in?source=extension";

  useEffect(() => {
    let cancelled = false;

    async function connectExtension() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.info("[Metis bridge] settings overlay started connect flow", {
        origin: window.location.origin,
        path: `${window.location.pathname}${window.location.search}`,
        queryExtensionId,
        hasSession: Boolean(session?.access_token),
      });
      const response = await sendBridgeSync({
        account,
        queryExtensionId,
        session: session?.access_token
          ? {
              accessToken: session.access_token,
              expiresAt: session.expires_at ? session.expires_at * 1000 : null,
              user: {
                id: session.user.id,
                email: session.user.email ?? null,
              },
            }
          : null,
      });

      console.info("[Metis bridge] settings overlay received connect result", response);

      if (cancelled) {
        return;
      }

      setDebugInfo(response.debug);

      if (response.ok) {
        setStatus("acknowledged");
        setErrorMessage(null);
        return;
      }

      setStatus("error");
      setErrorMessage(describeFailure(response.reason, response.detail));
    }

    void connectExtension();

    return () => {
      cancelled = true;
    };
  }, [account, describeFailure, queryExtensionId, supabase]);

  const title =
    status === "acknowledged"
      ? copy.successLabel
      : status === "error"
        ? copy.failureTitle
        : copy.title;

  const body =
    status === "acknowledged"
      ? copy.successBody
      : status === "error"
        ? errorMessage ?? copy.unknownFailureBody
        : copy.body;

  return (
    <div className="w-full rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-8 text-white shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
        {status === "acknowledged" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
        {copy.eyebrow}
      </span>
      <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">{body}</p>
      {email ? <p className="mt-4 text-sm text-white/45">{email}</p> : null}

      {status === "posting" ? (
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/75">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {copy.waitingLabel}
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={closeOverlay}
          className="inline-flex items-center gap-2 rounded-full bg-[#dc5e5e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c85151]"
        >
          {copy.closeLabel}
        </button>
        <Link
          href={retryHref}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/8 hover:text-white"
        >
          {copy.retryLabel}
        </Link>
      </div>

      {status === "error" ? (
        <div className="mt-6 rounded-[22px] border border-[rgba(220,94,94,0.28)] bg-[rgba(220,94,94,0.08)] px-4 py-4 text-sm leading-6 text-white/78">
          <p className="font-semibold text-white">{copy.failureTitle}</p>
          <p className="mt-2">{errorMessage ?? copy.unknownFailureBody}</p>
        </div>
      ) : null}

      <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white/78">
        <p className="font-semibold text-white">{copy.debugTitle}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="m-0 text-white/75">
            {copy.debugOriginLabel}: {debugInfo?.currentOrigin ?? window.location.origin}
          </p>
          <p className="m-0 text-white/75">
            {copy.debugRouteLabel}: {debugInfo?.currentPath ?? `${window.location.pathname}${window.location.search}`}
          </p>
          <p className="m-0 text-white/75">
            {copy.debugQueryExtensionIdLabel}: {debugInfo?.queryExtensionId ?? queryExtensionId ?? "none"}
          </p>
          <p className="m-0 text-white/75">
            {copy.debugConfiguredIdsLabel}: {debugInfo?.configuredExtensionIds.length ?? 0}
          </p>
          <p className="m-0 text-white/75">
            {copy.debugAttemptedIdLabel}: {debugInfo?.attemptedExtensionId ?? "none"}
          </p>
          <p className="m-0 text-white/75">
            {copy.debugStageLabel}: {debugInfo?.stage ?? "waiting"}
          </p>
        </div>
        <p className="mt-3 mb-0 text-white/55">{debugInfo?.detail ?? copy.debugWaitingBody}</p>
      </div>
    </div>
  );
}
