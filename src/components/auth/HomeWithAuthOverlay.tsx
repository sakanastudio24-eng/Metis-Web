import type { MetisAuthSource } from "@/lib/contracts/communication";

import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { LandingPage } from "@/components/landing/LandingPage";

type HomeWithAuthOverlayProps = {
  extensionId?: string | null;
  initialView: "signup" | "login";
  source?: MetisAuthSource | null;
  useLocalMagicLinkCallback?: boolean;
  initialError?: string | null;
  initialMessage?: string | null;
};

export function HomeWithAuthOverlay({
  extensionId = null,
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
