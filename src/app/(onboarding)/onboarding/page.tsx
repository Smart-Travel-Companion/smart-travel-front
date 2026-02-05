import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding";

export const metadata: Metadata = {
  title: "Configura tu perfil",
  description: "Personaliza tu experiencia de viaje en Smart Travel Companion",
};

// Usuario mock - en producción vendría de la sesión/auth
const mockUser = {
  name: "Juan",
  email: "juan@email.com",
};

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-3xl">
      <OnboardingWizard user={mockUser} />
    </div>
  );
}
