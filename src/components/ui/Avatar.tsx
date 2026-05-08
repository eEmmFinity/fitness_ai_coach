import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'primary' | 'accent';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

// Pick one of two gradients deterministically from the name
function pick(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h) % 2;
}

export function Avatar({ name, size = 'md', tone, className }: AvatarProps) {
  const grad =
    tone === 'accent' || (tone === undefined && pick(name) === 0)
      ? 'bg-grad-accent text-accent-foreground'
      : 'bg-grad-primary text-primary-foreground';
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold shadow-glow shrink-0',
        sizes[size],
        grad,
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
