// shadcn/ui-Muster (Button), von Hand vendored — keine CLI-/Netzabhängigkeit.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-stone-900 text-stone-50 hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300",
        secondary: "border border-[var(--linie)] bg-[var(--flaeche)] hover:bg-stone-100 dark:hover:bg-stone-800",
        accent: "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] border border-stone-900 hover:brightness-95",
        ghost: "hover:bg-stone-100 dark:hover:bg-stone-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";
