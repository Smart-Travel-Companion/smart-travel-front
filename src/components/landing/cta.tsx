import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="border-t border-border/40">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-100">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-size-[14px_24px]" />

          <div className="relative px-6 py-16 text-center md:px-12 md:py-24">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white dark:text-neutral-900 md:text-4xl lg:text-5xl">
              Comienza tu próxima aventura hoy
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-neutral-300 dark:text-neutral-600">
              Únete a miles de viajeros que ya están planificando sus
              experiencias de manera más inteligente.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                >
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-neutral-400 bg-transparent text-white hover:bg-white/10 dark:border-neutral-400 dark:text-neutral-900 dark:hover:bg-neutral-900/10"
                >
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
