import { redirect } from "next/navigation";

export default function VerifyPage() {
  redirect("/sign-in?message=Use%20the%20email%20link%20to%20finish%20access.");
}
