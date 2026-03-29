import { ResetPasswordScreen } from "@/components/auth/ResetPasswordScreen";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Choose a new password",
  description: "Set a new password to regain secure access to Metis.",
});

export default function ResetPasswordPage() {
  return <ResetPasswordScreen />;
}
