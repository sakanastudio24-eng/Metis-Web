import type { MetisAuthSource } from "@/lib/contracts/communication";

import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { LandingPage } from "@/components/landing/LandingPage";

type HomeWithAuthOverlayProps = {
  initialView: "signup" | "login";
  source?: MetisAuthSource | null;
  initialError?: string | null;
  initialMessage?: string | null;
};

export function HomeWithAuthOverlay({
  initialView,
  source = null,
  initialError = null,
  initialMessage = null,
}: HomeWithAuthOverlayProps) {
  return (
    <>
      <LandingPage />
      <AuthOverlay>
        <AuthScreen
          initialView={initialView}
          source={source}
          initialError={initialError}
          initialMessage={initialMessage}
        />
      </AuthOverlay>
    </>
  );
}
