import { redirect } from "next/navigation";

export default function ResetPasswordPage() {
  redirect("/sign-in?message=Use%20a%20fresh%20magic%20link%20instead.");
}
