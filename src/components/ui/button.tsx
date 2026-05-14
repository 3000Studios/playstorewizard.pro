"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-white text-bg-0 shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.18)] hover:-translate-y-0.5",
        aurora:
          "bg-grad-aurora text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(217,70,239,0.6)] hover:-translate-y-0.5",
        outline:
          "border border-border-strong bg-transparent text-text hover:bg-bg-2 hover:border-white/30",
        ghost: "text-text-muted hover:bg-bg-2 hover:text-text",
        link: "text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline px-0",
        destructive: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/30",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
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

export { buttonVariants };
