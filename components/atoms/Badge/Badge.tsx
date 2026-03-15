import { cn } from "@/utils/cn"

import { BadgeProps } from "./interfaces"

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-slate-900 text-slate-50 shadow": variant === "default",
          "border-transparent bg-emerald-100 text-emerald-800": variant === "success",
          "border-transparent bg-amber-100 text-amber-800": variant === "warning",
          "border-transparent bg-red-100 text-red-800": variant === "destructive",
          "text-slate-950 border-slate-200": variant === "outline",
        },
        className,
      )}
      {...props}
    />
  )
}
