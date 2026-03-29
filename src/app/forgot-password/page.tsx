import { ForgotPasswordScreen } from "@/components/auth/ForgotPasswordScreen";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Reset password",
  description: "Request a secure Metis password recovery link.",
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
