import * as React from "react"
import { cn } from "cn"

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label ref={className ? undefined : ref} className={className} {...props} />
))

Label.displayName = "Label"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { rows?: number }
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={className}
    {...props}
  />
))

Input.displayName = "Input"

export const Select = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))

Select.displayName = "Select"

export const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))

SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string }
>(({ className, value, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {value ? `${value}` : children}
  </div>
))

SelectValue.displayName = "SelectValue"

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))

SelectContent.displayName = "SelectContent"

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "selected"> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    onClick={() => {}}
    role="option"
    {...props}
  >
    {children}
  </div>
))

SelectItem.displayName = "SelectItem"