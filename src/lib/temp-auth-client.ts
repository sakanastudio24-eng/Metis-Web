export async function startTemporaryAuthSession() {
  // The temporary route only prepares a local review cookie. It is never a
  // substitute for a provider-backed or backend-valid session.
  const response = await fetch("/auth/temp-login", {
    method: "POST",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error("temporary_auth_failed");
  }
}

export async function clearTemporaryAuthSession() {
  await fetch("/auth/temp-logout", {
    method: "POST",
    credentials: "same-origin",
  });
}
