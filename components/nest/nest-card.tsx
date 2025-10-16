import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

export function NestCard({
  children,
  className = "",
  hover = false,
  onClick
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm",
        hover && "transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function NestCardHeader({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function NestCardTitle({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-semibold", className)}>
      {children}
    </h3>
  );
}

export function NestCardContent({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
