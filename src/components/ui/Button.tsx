import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'accent';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const base =
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ' +
  'rounded-md select-none transition-[transform,box-shadow,background-color,color] duration-150 ' +
  'focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ' +
  'active:translate-y-px';

const variants: Record<ButtonVariant, string> = {
  // Primary — gradient + subtle inner highlight + glow on hover. The hero CTA.
  primary:
    'text-primary-foreground bg-grad-primary shadow-card ' +
    'hover:shadow-glow hover:brightness-[1.06] ' +
    'before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none ' +
    'before:bg-[linear-gradient(to_bottom,hsl(0_0%_100%/0.18),transparent_45%)]',
  // Default mirrors primary so existing call sites keep working
  default:
    'text-primary-foreground bg-grad-primary shadow-card ' +
    'hover:shadow-glow hover:brightness-[1.06] ' +
    'before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none ' +
    'before:bg-[linear-gradient(to_bottom,hsl(0_0%_100%/0.18),transparent_45%)]',
  // Accent — cyan→lime, used for "active workout" / streak / Pro CTA
  accent:
    'bg-grad-accent text-accent-foreground shadow-card hover:brightness-[1.06]',
  // Secondary — flat surface, pops against background
  secondary:
    'bg-secondary text-secondary-foreground border border-border ' +
    'hover:bg-surface-2',
  // Outline — gradient border with transparent fill; gradient text on hover
  outline:
    'border border-border bg-transparent text-foreground ' +
    'hover:border-transparent hover:bg-surface-2',
  // Ghost — minimal, used in toolbars
  ghost: 'text-foreground hover:bg-surface-2',
  // Destructive — flat rose, no gradient (gradient destructive looks playful)
  destructive:
    'text-white bg-[hsl(var(--danger))] hover:brightness-110 shadow-card',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            leftIcon
          )}
          {children}
          {!isLoading && rightIcon}
        </span>
      </button>
    );
  }
);
