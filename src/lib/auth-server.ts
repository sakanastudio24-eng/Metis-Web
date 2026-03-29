import { redirect } from "next/navigation";

import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedUserDetails = {
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
  user: User;
};

export async function requireAuthenticatedUser(): Promise<AuthenticatedUserDetails> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return {
    email: user.email ?? null,
    provider: typeof user.app_metadata?.provider === "string" ? user.app_metadata.provider : "email",
    emailConfirmed: Boolean(user.email_confirmed_at),
    user,
  };
}
