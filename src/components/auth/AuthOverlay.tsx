"use client";

import type { ReactNode } from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

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
        className="absolute inset-0 bg-[rgba(6,10,15,0.56)] backdrop-blur-md"
        onClick={closeOverlay}
      />
      <div className="relative z-10 w-full max-w-lg">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/78 transition hover:bg-white/10 hover:text-white"
          onClick={closeOverlay}
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
