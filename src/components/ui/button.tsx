"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-0 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-white text-bg-0 shadow-[0_4px_24px_rgba(255,255,255,0.14)] hover:shadow-[0_10px_36px_rgba(255,255,255,0.32),0_0_0_1px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 hover:brightness-105",
        aurora:
          "bg-grad-aurora text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.6)] hover:shadow-[0_14px_36px_-6px_rgba(217,70,239,0.7),0_0_28px_0_rgba(99,102,241,0.45),inset_0_0_0_1px_rgba(255,255,255,0.18)] hover:-translate-y-0.5 hover:brightness-110 hover:saturate-110",
        outline:
          "border border-border-strong bg-transparent text-text hover:bg-bg-2 hover:border-indigo-300/60 hover:shadow-[0_0_22px_-4px_rgba(165,180,252,0.5)]",
        ghost: "text-text-muted hover:bg-bg-2 hover:text-text",
        link: "text-indigo-300 hover:text-indigo-200 underline-offset-4 hover:underline px-0",
        destructive: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/30 hover:shadow-[0_10px_28px_-6px_rgba(248,113,113,0.65)]",
      },
      size: {
        sm: "h-9 px-3.5 text-[14px]",
        md: "h-11 px-4 text-[15px]",
        lg: "h-12 px-6 text-[16px]",
        xl: "h-14 px-8 text-[17px]",
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
