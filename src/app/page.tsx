import { Header, Footer } from "@/components/layout";
import { Hero, HowItWorks, Features, Partners, CTA } from "@/components/landing";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
