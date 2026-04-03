import { redirect } from "next/navigation";

import type { User } from "@supabase/supabase-js";

import { METIS_AUTH_SUCCESS_PATH, type MetisAuthSource, isExtensionAuthSource } from "@/lib/contracts/communication";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedUserDetails = {
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
  user: User;
};

export async function getAuthenticatedUserOrNull(): Promise<AuthenticatedUserDetails | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return {
      email: user.email ?? null,
      provider: typeof user.app_metadata?.provider === "string" ? user.app_metadata.provider : "email",
      emailConfirmed: Boolean(user.email_confirmed_at),
      user,
    };
  }

  return null;
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUserDetails> {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export async function redirectIfAuthenticated(source?: MetisAuthSource | null) {
  const user = await getAuthenticatedUserOrNull();

  if (user) {
    redirect(isExtensionAuthSource(source) ? METIS_AUTH_SUCCESS_PATH : "/account");
  }
}
