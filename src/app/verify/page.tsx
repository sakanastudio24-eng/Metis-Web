import { MailCheck } from "lucide-react";

import AuthCard07 from "@/components/block/AuthCard/authcard-07/authcard";
import { authCopy } from "@/content/authCopy";
import { siteLinks } from "@/content/frontFacingCopy";

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
        <div className="space-y-3 rounded-[28px] bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {params?.email ? (
            <p className="rounded-2xl bg-white px-4 py-3 font-medium text-slate-700">{copy.emailLabel(params.email)}</p>
          ) : null}
          <p>{copy.body}</p>
          <p>
            Allowed callback URLs stay on <span className="font-medium text-slate-900">/auth/callback</span>, and this
            verification step keeps the front-facing flow clear.
          </p>
          <a href={siteLinks.waitlistUrl} className="inline-flex font-semibold text-[#c44a4a] hover:text-[#a93b3b]">
            Continue exploring Metis
          </a>
        </div>
      </AuthCard07>
    </main>
  );
}
