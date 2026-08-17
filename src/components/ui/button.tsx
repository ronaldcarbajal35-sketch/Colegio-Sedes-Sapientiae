import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-smooth select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]"

    const variants = {
      primary: "bg-primary text-on-primary hover:bg-primary-container focus:ring-primary shadow-sm hover:shadow",
      secondary: "bg-secondary text-white hover:bg-secondary-container hover:text-on-surface focus:ring-secondary",
      outline: "border border-outline/30 bg-transparent text-on-surface hover:bg-surface-container focus:ring-primary",
      ghost: "bg-transparent text-on-surface hover:bg-surface-container focus:ring-primary",
      danger: "bg-error text-white hover:bg-error/90 focus:ring-error shadow-sm",
      success: "bg-success text-white hover:bg-success/90 focus:ring-success shadow-sm",
    }

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-4 py-2 rounded-lg gap-2",
      lg: "text-base px-6 py-3 rounded-xl gap-2.5 font-semibold",
      icon: "p-2 rounded-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
