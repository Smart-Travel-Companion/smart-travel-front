import { partners } from "@/constants";

export function Partners() {
  return (
    <section id="partners" className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Nuestra Red de Confianza
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Conectados con los mejores
          </h2>
          <p className="text-muted-foreground">
            Integramos información de las principales plataformas para ofrecerte
            las mejores opciones.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {partners.map((partner) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.name}
                className="group flex flex-col items-center rounded-xl border border-border/50 bg-background p-8 text-center transition-all hover:border-border hover:shadow-md"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mb-1 font-semibold">{partner.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {partner.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
