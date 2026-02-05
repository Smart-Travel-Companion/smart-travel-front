"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Compass } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { navItems } from "@/constants";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-semibold sm:inline-block">
            Smart Travel Companion
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Comenzar</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-87.5 px-6">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex flex-col gap-8 pt-8">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <Compass className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-semibold">Smart Travel</span>
                </Link>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent",
                        pathname === item.href
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-3 border-t border-border/40 pt-6">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="lg" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button size="lg" className="w-full">
                      Comenzar
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
