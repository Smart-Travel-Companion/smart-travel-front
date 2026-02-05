import Link from "next/link";
import { Compass } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">Smart Travel</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <div className="grid min-h-screen lg:grid-cols-5">
        {/* Left side - Form (3 columns) */}
        <div className="col-span-3 flex items-center justify-center px-4 py-24 md:px-8">
          {children}
        </div>

        {/* Right side - Decorative (2 columns) */}
        <div className="relative col-span-2 hidden bg-muted lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-100" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)]" />

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center p-12 text-center">
            {/* Decorative travel icons */}
            <div className="mb-8 grid grid-cols-3 gap-6 opacity-20">
              {["🗺️", "✈️", "🏔️", "🏖️", "🎒", "🌍", "🏛️", "🍽️", "🌲"].map(
                (emoji, i) => (
                  <span key={i} className="text-4xl">
                    {emoji}
                  </span>
                )
              )}
            </div>

            <blockquote className="max-w-sm space-y-4">
              <p className="text-xl font-medium leading-relaxed text-white dark:text-neutral-900">
                &ldquo;Cada viaje comienza con un solo paso. Configura tus
                preferencias y deja que la IA haga el resto.&rdquo;
              </p>
              <footer className="text-neutral-400 dark:text-neutral-600">
                <p className="text-sm">Smart Travel Companion</p>
              </footer>
            </blockquote>

            {/* Features list */}
            <div className="mt-12 space-y-4 text-left">
              {[
                "Itinerarios personalizados con IA",
                "Recomendaciones en tiempo real",
                "Mapas interactivos con POIs",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-neutral-300 dark:text-neutral-700"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 dark:bg-black/10">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
