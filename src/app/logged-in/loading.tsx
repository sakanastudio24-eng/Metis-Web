export default function Loading() {
  return (
    <div className="auth-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[rgba(17,29,43,0.96)] p-8 text-white shadow-[0_40px_120px_rgba(0,0,0,0.52)] backdrop-blur">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#dc5e5e]/30 bg-[#dc5e5e]/12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#dc5e5e]/25 border-t-[#dc5e5e]" />
        </div>
        <h1 className="mt-5 text-4xl leading-none tracking-[-0.05em]" style={{ fontFamily: "var(--font-serif), serif" }}>
          Loading setup...
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
          Metis is preparing your onboarding state and account-backed setup flow.
        </p>
      </div>
    </div>
  );
}
