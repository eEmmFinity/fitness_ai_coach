import React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'hero' | 'glass' | 'outlined' | 'flat';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-card text-card-foreground border border-border shadow-card',
  // Hero card — gradient surface + dotted backdrop. Use ONCE per page.
  hero:
    'bg-grad-hero text-white border border-white/10 shadow-elev overflow-hidden',
  // Glass — frosted top bar / floating panels
  glass:
    'surface-glass text-foreground border border-white/[0.08] shadow-elev',
  // Outlined — quiet plate, used inside busy lists
  outlined:
    'bg-transparent text-foreground border border-border',
  // Flat — used inside other cards (sub-panels) without doubling shadow
  flat: 'bg-surface-2 text-foreground border border-border/60',
};

export function Card({
  children,
  className,
  hover = false,
  variant = 'default',
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        'rounded-lg p-6 relative',
        variantStyles[variant],
        hover &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elev hover:border-primary/30',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mb-4 space-y-1', className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mt-5 pt-4 border-t border-border/60', className)}>
      {children}
    </div>
  );
}
