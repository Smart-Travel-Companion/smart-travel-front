import { steps } from "@/constants";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground">
            Tres simples pasos para crear tu experiencia de viaje perfecta.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-border/50 bg-background p-8 transition-all hover:border-border hover:shadow-lg"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
