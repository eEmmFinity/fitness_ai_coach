'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface AppShellProps {
  title: string;
  subtitle?: string;
  /** Lucide icon shown next to the title */
  Icon?: LucideIcon;
  /** Tone for the title chip */
  tone?: 'primary' | 'accent';
  nav: NavItem[];
  /** Right-aligned action node (button group, filters, etc.) */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({
  title,
  subtitle,
  Icon,
  tone = 'primary',
  nav,
  actions,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const chip =
    tone === 'accent' ? 'bg-grad-accent text-accent-foreground' : 'bg-grad-primary text-primary-foreground';

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Sticky page header */}
      <div className="sticky top-16 z-30 surface-glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          {Icon && (
            <span
              className={cn(
                'w-9 h-9 rounded-md flex items-center justify-center shadow-glow',
                chip
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <nav
            aria-label="Section navigation"
            className="md:sticky md:top-32 md:self-start flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-1 px-1"
          >
            {nav.map((item) => {
              const NavIcon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group inline-flex items-center gap-2 px-3 h-9 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'bg-surface-2 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/60'
                  )}
                >
                  <NavIcon
                    className={cn(
                      'h-4 w-4',
                      active && (tone === 'accent' ? 'text-accent-from' : 'text-primary')
                    )}
                  />
                  {item.name}
                  {item.badge !== undefined && Number(item.badge) > 0 && (
                    <span
                      className={cn(
                        'ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular',
                        active
                          ? 'bg-grad-primary text-primary-foreground'
                          : 'bg-secondary text-foreground'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
