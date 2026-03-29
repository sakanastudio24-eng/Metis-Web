import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { LandingPage } from "@/components/landing/LandingPage";

type HomeWithAuthOverlayProps = {
  mode: "sign-in" | "sign-up";
  initialError?: string | null;
  initialMessage?: string | null;
};

export function HomeWithAuthOverlay({
  mode,
  initialError = null,
  initialMessage = null,
}: HomeWithAuthOverlayProps) {
  return (
    <>
      <LandingPage />
      <AuthOverlay>
        <AuthScreen mode={mode} initialError={initialError} initialMessage={initialMessage} />
      </AuthOverlay>
    </>
  );
}
