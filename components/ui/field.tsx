import * as React from "react"
import { cn } from "@/lib/utils"

export function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props} />
  )
}

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props} />
  )
}

export function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

export function FieldDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export function FieldSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex items-center text-xs uppercase text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="flex-1 border-t" />
      <span className="px-2">{props.children}</span>
      <span className="flex-1 border-t" />
    </div>
  )
}
