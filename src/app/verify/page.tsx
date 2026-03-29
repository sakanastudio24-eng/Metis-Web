import { MailCheck } from "lucide-react";

import AuthCard07 from "@/components/block/AuthCard/authcard-07/authcard";
import { authCopy } from "@/content/authCopy";
import { siteLinks } from "@/content/frontFacingCopy";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata({
  title: "Verify email",
  description: "Finish email verification before signing in to Metis.",
});

type VerifyPageProps = {
  searchParams?: Promise<{
    email?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const copy = authCopy.verify;

  return (
    <main className="auth-shell flex items-center justify-center">
      <AuthCard07
        badge={copy.eyebrow}
        title={copy.title}
        description={copy.intro}
        icon={<MailCheck className="h-7 w-7" />}
        primaryAction={{ href: "/sign-in", label: copy.primaryLabel }}
        secondaryAction={{ href: "/sign-up", label: copy.secondaryLabel }}
      >
        <div className="space-y-3 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/65">
          {params?.email ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white/85">
              {copy.emailLabel(params.email)}
            </p>
          ) : null}
          <p>{copy.body}</p>
          <p>Your verification link returns to the secure Metis access flow once it is complete.</p>
          <a href={siteLinks.waitlistUrl} className="inline-flex font-semibold text-[#ffb8b8] hover:text-white">
            Continue exploring Metis
          </a>
        </div>
      </AuthCard07>
    </main>
  );
}
