import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { NestLogo } from "./nest-logo";

interface NestButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  withNest?: boolean;
  children: ReactNode;
}

export function NestButton({
  variant = "primary",
  size = "default",
  withNest = false,
  className = "",
  children,
  ...props
}: NestButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm hover:shadow",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm hover:shadow",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "hover:bg-muted text-foreground"
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    default: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        withNest && "group",
        className
      )}
      {...props}
    >
      {withNest && (
        <NestLogo className={cn(
          "transition-transform group-hover:animate-nest-bounce",
          size === "sm" && "w-4 h-4",
          size === "default" && "w-5 h-5",
          size === "lg" && "w-6 h-6"
        )} />
      )}
      {children}
    </button>
  );
}
