import { redirect } from "next/navigation";

import { LoggedInState } from "@/components/auth/LoggedInState";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoggedInPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <LoggedInState email={user.email ?? null} />;
}
