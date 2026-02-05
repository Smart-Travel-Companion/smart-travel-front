"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface StepContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
}

export function StepContainer({
  title,
  description,
  children,
  onNext,
  onBack,
  isFirstStep = false,
  isLastStep = false,
  isNextDisabled = false,
  isLoading = false,
  nextLabel,
}: StepContainerProps) {
  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4">
        {!isFirstStep && onBack ? (
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Button>
        ) : (
          <div />
        )}

        <Button
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="gap-2"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : isLastStep ? (
            <>
              <Sparkles className="h-4 w-4" />
              {nextLabel || "Comenzar mi aventura"}
            </>
          ) : (
            <>
              {nextLabel || "Continuar"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
