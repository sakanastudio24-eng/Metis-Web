import { redirect } from "next/navigation";

export default function ForgotPasswordPage() {
  redirect("/sign-in?message=Use%20a%20magic%20link%20instead.");
}
