"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearTemporaryAuthSession } from "@/lib/temp-auth-client";

function isReloadNavigation() {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return false;
  }

  const [entry] = performance.getEntriesByType("navigation");

  return entry instanceof PerformanceNavigationTiming && entry.type === "reload";
}

export function useTemporarySessionGuard(isTemporary: boolean) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!isTemporary || !isReloadNavigation()) {
      return;
    }

    setIsResetting(true);

    void (async () => {
      await clearTemporaryAuthSession();
      router.replace("/sign-in?message=Testing+token+cleared+after+reload");
    })();
  }, [isTemporary, router]);

  return isResetting;
}
