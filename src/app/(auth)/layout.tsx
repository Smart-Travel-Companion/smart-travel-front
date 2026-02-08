import Link from "next/link";
import { Compass } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({
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
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side - Form */}
        <div className="flex items-center justify-center px-4 py-20 md:px-8">
          {children}
        </div>

        {/* Right side - Decorative */}
        <div className="relative hidden bg-muted lg:block">
          <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-100" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[14px_24px] dark:bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)]" />

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center p-12 text-center">
            <blockquote className="max-w-lg space-y-4">
              <p className="text-2xl font-medium leading-relaxed text-white dark:text-neutral-900">
                &ldquo;La mejor inversión que puedes hacer es en tu próxima
                aventura.&rdquo;
              </p>
              <footer className="text-neutral-400 dark:text-neutral-600">
                <p className="font-medium text-neutral-300 dark:text-neutral-700">
                  Smart Travel Companion
                </p>
                <p className="text-sm">Planifica inteligentemente, viaja mejor</p>
              </footer>
            </blockquote>

            {/* Decorative elements */}
            <div className="absolute bottom-12 left-12 right-12">
              <div className="flex items-center justify-center gap-8 text-neutral-500 dark:text-neutral-500">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white dark:text-neutral-900">
                    10K+
                  </p>
                  <p className="text-sm">Viajeros</p>
                </div>
                <div className="h-8 w-px bg-neutral-700 dark:bg-neutral-300" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-white dark:text-neutral-900">
                    50+
                  </p>
                  <p className="text-sm">Destinos</p>
                </div>
                <div className="h-8 w-px bg-neutral-700 dark:bg-neutral-300" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-white dark:text-neutral-900">
                    98%
                  </p>
                  <p className="text-sm">Satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
