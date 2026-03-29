"use client";

import type { ReactNode } from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthOverlayProps = {
  children: ReactNode;
};

export function AuthOverlay({ children }: AuthOverlayProps) {
  const router = useRouter();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function closeOverlay() {
    router.replace("/");
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center px-4 py-8 sm:px-6">
      <button
        type="button"
        aria-label="Close auth overlay"
        className="absolute inset-0 bg-[rgba(6,1,1,0.78)] backdrop-blur-[14px]"
        onClick={() => router.replace("/")}
      />
      <div className="relative z-10 w-full max-w-[500px]">{children}</div>
    </div>
  );
}
