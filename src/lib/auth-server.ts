import { redirect } from "next/navigation";

import type { User } from "@supabase/supabase-js";

import { deriveAccountUsername, getDeletedAtFromUser } from "@/lib/auth";
import { METIS_AUTH_SUCCESS_PATH, type MetisAuthSource, isExtensionAuthSource } from "@/lib/contracts/communication";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedUserDetails = {
  deletedAt: string | null;
  email: string | null;
  provider: string;
  emailConfirmed: boolean;
  username: string;
  user: User;
};

export async function getAuthenticatedUserOrNull(): Promise<AuthenticatedUserDetails | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return {
      deletedAt: getDeletedAtFromUser(user),
      email: user.email ?? null,
      provider: typeof user.app_metadata?.provider === "string" ? user.app_metadata.provider : "email",
      emailConfirmed: Boolean(user.email_confirmed_at),
      username: deriveAccountUsername(user.email ?? null),
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

  if (user.deletedAt) {
    // Soft-deleted accounts should never keep browsing protected surfaces, even
    // if a stale session cookie still exists in the browser.
    redirect("/account-deleted");
  }

  return user;
}

export async function redirectIfAuthenticated(
  source?: MetisAuthSource | null,
  extensionId?: string | null
) {
  const user = await getAuthenticatedUserOrNull();

  if (user) {
    if (user.deletedAt) {
      redirect("/account-deleted");
    }

    if (isExtensionAuthSource(source)) {
      const url = new URL(METIS_AUTH_SUCCESS_PATH, "https://metis.zward.studio");
      url.searchParams.set("source", source);

      if (extensionId) {
        url.searchParams.set("extensionId", extensionId);
      }

      redirect(`${url.pathname}${url.search}`);
    }

    redirect("/account");
  }
}
