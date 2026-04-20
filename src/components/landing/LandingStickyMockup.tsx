import { LandingChromeClient } from "@/components/landing/LandingChromeClient";

export function LandingStickyMockup() {
  return (
    <aside className="metis-landing-sticky" aria-label="Metis extension preview">
      <div className="metis-landing-sticky__card">
        <LandingChromeClient mockupOnly />
      </div>
    </aside>
  );
}
