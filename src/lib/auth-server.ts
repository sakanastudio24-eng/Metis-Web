import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import type { User } from "@supabase/supabase-js";

import { METIS_AUTH_SUCCESS_PATH, type MetisAuthSource, isExtensionAuthSource } from "@/lib/contracts/communication";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildTemporarySession,
  getTemporaryAuthCookieName,
  getTemporaryAuthCookieValue,
  isTemporaryAuthEnabled,
} from "@/lib/temp-auth";

export type AuthenticatedUserDetails = {
  kind: "real" | "temporary";
  isTemporary: boolean;
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
  user: User | null;
};

export async function getAuthenticatedUserOrNull(): Promise<AuthenticatedUserDetails | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return {
      kind: "real",
      isTemporary: false,
      email: user.email ?? null,
      provider: typeof user.app_metadata?.provider === "string" ? user.app_metadata.provider : "email",
      emailConfirmed: Boolean(user.email_confirmed_at),
      user,
    };
  }

  if (!isTemporaryAuthEnabled()) {
    return null;
  }

  const cookieStore = await cookies();
  const temporaryCookie = cookieStore.get(getTemporaryAuthCookieName())?.value;

  if (temporaryCookie !== getTemporaryAuthCookieValue()) {
    return null;
  }

  // Temporary sessions are only for local UI review. They never stand in for
  // real backend auth and should stay fenced to development.
  return buildTemporarySession();
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

  // Temporary review sessions should stay visible on auth entry routes so local
  // testing does not accidentally mask the real sign-in experience.
  if (user && !user.isTemporary) {
    redirect(isExtensionAuthSource(source) ? METIS_AUTH_SUCCESS_PATH : "/account");
  }
}
