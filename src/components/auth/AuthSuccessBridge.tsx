"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CheckCircle2, ExternalLink, LoaderCircle } from "lucide-react";

import { authCopy } from "@/content/authCopy";
import {
  METIS_AUTH_SUCCESS_PATH,
  isMetisAuthFailureAck,
  type MetisAuthSuccessMessage,
  isAllowedBridgeOrigin,
  isMetisAuthSuccessAck,
} from "@/lib/contracts/communication";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type BridgeStatus = "posting" | "acknowledged" | "fallback" | "error";

type AuthSuccessBridgeProps = {
  email: string | null;
};

export function AuthSuccessBridge({ email }: AuthSuccessBridgeProps) {
  const router = useRouter();
  const copy = authCopy.bridge;
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [status, setStatus] = useState<BridgeStatus>("posting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const describeFailure = useCallback(
    (reason: string, detail?: string, endpoint?: string) => {
      switch (reason) {
        case "validation_endpoint_unreachable":
          return `${copy.endpointFailureBody}${endpoint ? ` Endpoint: ${endpoint}.` : ""}${detail ? ` ${detail}` : ""}`;
        case "validation_rejected":
          return `${copy.validationRejectedBody}${detail ? ` ${detail}` : ""}`;
        case "invalid_account_payload":
          return `${copy.invalidAccountBody}${detail ? ` ${detail}` : ""}`;
        case "storage_failed":
          return `${copy.storageFailureBody}${detail ? ` ${detail}` : ""}`;
        case "extension_unavailable":
          return `${copy.extensionUnavailableBody}${detail ? ` ${detail}` : ""}`;
        default:
          return detail ?? copy.unknownFailureBody;
      }
    },
    [copy.endpointFailureBody, copy.extensionUnavailableBody, copy.invalidAccountBody, copy.storageFailureBody, copy.unknownFailureBody, copy.validationRejectedBody]
  );

  const closeOverlay = useCallback(() => {
    router.replace(METIS_AUTH_SUCCESS_PATH);
  }, [router]);

  useEffect(() => {
    let timeoutId: number | undefined;
    let cancelled = false;

    async function handoffToExtension() {
      // The bridge only runs on the exact success route and known website
      // origins so this page cannot become a general message relay.
      if (!isAllowedBridgeOrigin(window.location.origin) || window.location.pathname !== METIS_AUTH_SUCCESS_PATH) {
        setStatus("error");
        setErrorMessage(copy.invalidOriginBody);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token || !session.user) {
        setStatus("error");
        setErrorMessage(copy.invalidSessionBody);
        return;
      }

      const payload: MetisAuthSuccessMessage = {
        type: "METIS_AUTH_SUCCESS",
        source: "metis-web",
        version: 1,
        session: {
          accessToken: session.access_token,
          expiresAt: session.expires_at ?? null,
          user: {
            id: session.user.id,
            email: session.user.email ?? null,
          },
        },
      };

      function onMessage(event: MessageEvent) {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (cancelled) {
          return;
        }

        if (isMetisAuthSuccessAck(event.data)) {
          window.clearTimeout(timeoutId);
          setStatus("acknowledged");
          return;
        }

        if (isMetisAuthFailureAck(event.data)) {
          window.clearTimeout(timeoutId);
          setStatus("error");
          setErrorMessage(
            describeFailure(event.data.reason, event.data.detail, event.data.endpoint)
          );
        }
      }

      window.addEventListener("message", onMessage);
      window.postMessage(payload, window.location.origin);

      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(copy.extensionUnavailableBody);
        }
      }, 4500);

      return () => {
        window.removeEventListener("message", onMessage);
        window.clearTimeout(timeoutId);
      };
    }

    let cleanup: (() => void) | undefined;
    void handoffToExtension().then((nextCleanup) => {
      cleanup = nextCleanup;
    });

    return () => {
      cancelled = true;
      cleanup?.();
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    closeOverlay,
    copy.extensionUnavailableBody,
    copy.invalidOriginBody,
    copy.invalidSessionBody,
    describeFailure,
    supabase
  ]);

  const title =
    status === "acknowledged"
      ? copy.successLabel
      : status === "error"
        ? copy.invalidSessionTitle
        : copy.title;

  const body =
    status === "acknowledged"
      ? copy.successBody
      : status === "fallback"
        ? copy.extensionUnavailableBody
        : status === "error"
          ? errorMessage ?? copy.invalidSessionBody
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
          href="/sign-in?source=extension"
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
    </div>
  );
}
