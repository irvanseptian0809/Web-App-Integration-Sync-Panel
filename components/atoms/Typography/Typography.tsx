import * as React from "react"

import { cn } from "@/utils/cn"

export const TypographyH1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
    {...props}
  />
))
TypographyH1.displayName = "TypographyH1"

export const TypographyH2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      className,
    )}
    {...props}
  />
))
TypographyH2.displayName = "TypographyH2"

export const TypographyH3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}
    {...props}
  />
))
TypographyH3.displayName = "TypographyH3"

export const TypographyP = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
))
TypographyP.displayName = "TypographyP"

export const TypographySmall = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <small ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />
))
TypographySmall.displayName = "TypographySmall"

export const TypographyMuted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-slate-500", className)} {...props} />
))
TypographyMuted.displayName = "TypographyMuted"
