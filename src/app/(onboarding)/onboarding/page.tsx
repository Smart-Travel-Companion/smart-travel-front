"use client";

import { OnboardingWizard } from "@/components/onboarding";
import { AuthGuard } from "@/components/layout/auth-guard";
import { useAuth } from "@/providers/auth-provider";

export default function OnboardingPage() {
  const { user } = useAuth();

  const firstName = user?.nombre?.split(" ")[0] || "Viajero";

  return (
    <AuthGuard>
      <div className="w-full max-w-3xl">
        <OnboardingWizard user={{ name: firstName }} />
      </div>
    </AuthGuard>
  );
}
