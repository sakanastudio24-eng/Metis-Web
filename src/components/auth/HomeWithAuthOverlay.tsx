import { AuthOverlay } from "@/components/auth/AuthOverlay";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { LandingPage } from "@/components/landing/LandingPage";

type HomeWithAuthOverlayProps = {
  initialView: "signup" | "login";
  initialError?: string | null;
  initialMessage?: string | null;
};

export function HomeWithAuthOverlay({
  initialView,
  initialError = null,
  initialMessage = null,
}: HomeWithAuthOverlayProps) {
  return (
    <>
      <LandingPage />
      <AuthOverlay>
        <AuthScreen initialView={initialView} initialError={initialError} initialMessage={initialMessage} />
      </AuthOverlay>
    </>
  );
}
