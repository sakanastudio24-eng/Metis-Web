import type { MetisAuthSource } from "@/lib/contracts/communication";

import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { LandingPage } from "@/components/landing/LandingPage";

type HomeWithAuthOverlayProps = {
  extensionId?: string | null;
  initialEmail?: string | null;
  intent?: string | null;
  initialView: "signup" | "login";
  source?: MetisAuthSource | null;
  useLocalMagicLinkCallback?: boolean;
  initialError?: string | null;
  initialMessage?: string | null;
};

export function HomeWithAuthOverlay({
  extensionId = null,
  initialEmail = null,
  intent = null,
  initialView,
  source = null,
  useLocalMagicLinkCallback = false,
  initialError = null,
  initialMessage = null,
}: HomeWithAuthOverlayProps) {
  return (
    <>
      <LandingPage />
      <AuthOverlay>
        <AuthScreen
          extensionId={extensionId}
          initialEmail={initialEmail}
          intent={intent}
          initialView={initialView}
          source={source}
          useLocalMagicLinkCallback={useLocalMagicLinkCallback}
          initialError={initialError}
          initialMessage={initialMessage}
        />
      </AuthOverlay>
    </>
  );
}
