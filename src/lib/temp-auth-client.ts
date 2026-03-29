export async function startTemporaryAuthSession() {
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
