import { features } from "@/constants";

export function Features() {
  return (
    <section id="features" className="border-t border-border/40">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Todo lo que necesitas para viajar mejor
          </h2>
          <p className="text-muted-foreground">
            Herramientas inteligentes diseñadas para simplificar cada aspecto de
            tu planificación.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-border/50 bg-background p-6 transition-all hover:border-border hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
