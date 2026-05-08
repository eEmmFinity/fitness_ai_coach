'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Sun,
  Moon,
  Dumbbell,
  Home,
  LayoutDashboard,
  Calculator,
  MessageSquare,
  User,
  LogOut,
  Camera,
  Shield,
  Users,
  UserPlus,
  CreditCard,
  Sparkles,
  Wrench,
  Inbox,
  UserCircle,
  ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NavItem = { name: string; href: string; icon: LucideIcon };

const TOOLS: NavItem[] = [
  { name: 'Live Workout', href: '/live-workout', icon: Camera },
  { name: 'AI Coach', href: '/ai-coach', icon: MessageSquare },
  { name: 'Calculators', href: '/calculators', icon: Calculator },
];

function navigationFor(role: string | undefined): {
  primary: NavItem[];
  tools: NavItem[];
} {
  if (!role)
    return {
      primary: [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Live Workout', href: '/live-workout', icon: Camera },
      ],
      tools: [],
    };

  if (role === 'admin')
    return {
      primary: [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Coach apps', href: '/admin/coach-applications', icon: Inbox },
      ],
      tools: TOOLS,
    };

  if (role === 'coach')
    return {
      primary: [
        { name: 'Overview', href: '/coach', icon: LayoutDashboard },
        { name: 'Clients', href: '/coach/clients', icon: Users },
        { name: 'Messages', href: '/coach/messages', icon: MessageSquare },
        { name: 'Requests', href: '/coach/requests', icon: Inbox },
        { name: 'Profile', href: '/coach/profile', icon: UserCircle },
      ],
      tools: TOOLS,
    };

  // user / pending_coach
  return {
    primary: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Live Workout', href: '/live-workout', icon: Camera },
      { name: 'AI Coach', href: '/ai-coach', icon: MessageSquare },
      { name: 'Messages', href: '/messages', icon: Inbox },
      { name: 'Find Coach', href: '/coaches', icon: UserPlus },
      { name: 'Profile', href: '/profile', icon: User },
    ],
    tools: [
      { name: 'Calculators', href: '/calculators', icon: Calculator },
      { name: 'Billing', href: '/billing', icon: CreditCard },
    ],
  };
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const toolsBtnRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const { primary, tools } = navigationFor(user?.role);
  const isActive = (path: string) =>
    pathname === path || (path !== '/' && pathname.startsWith(path + '/'));

  const isMessagesItem = (href: string) =>
    href === '/messages' || href === '/coach/messages';

  // Poll the unread badge for messaging-eligible users
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchUnread = async () => {
      try {
        const r = await fetch('/api/messages/unread');
        if (!r.ok || cancelled) return;
        const j = await r.json();
        setUnread(j.count ?? 0);
      } catch {
        /* ignore */
      }
    };
    fetchUnread();
    const t = setInterval(fetchUnread, 15_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [user, pathname]);

  // Close Tools dropdown on outside click
  useEffect(() => {
    if (!toolsOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (
        toolsBtnRef.current &&
        !toolsBtnRef.current.contains(e.target as Node)
      ) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [toolsOpen]);

  const roleLabel = user?.role
    ? user.role === 'pending_coach'
      ? 'Pending'
      : user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : null;

  return (
    <nav className="sticky top-0 z-50 surface-glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href={user ? '/' : '/'} className="flex items-center gap-2.5 group">
            <span className="relative w-9 h-9 rounded-md bg-grad-primary flex items-center justify-center shadow-glow">
              <Dumbbell className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-grad-accent" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              Fitness <span className="text-grad-primary">AI</span>
            </span>
          </Link>

          {/* Desktop primary nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {primary.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const showUnread = isMessagesItem(item.href) && unread > 0;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'text-foreground bg-surface-2'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/60'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  {showUnread && (
                    <span className="ml-1 text-[10px] font-semibold tabular bg-grad-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </Link>
              );
            })}

            {tools.length > 0 && (
              <div ref={toolsBtnRef} className="relative">
                <button
                  type="button"
                  onClick={() => setToolsOpen((o) => !o)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-medium transition-colors',
                    tools.some((t) => isActive(t.href))
                      ? 'text-foreground bg-surface-2'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/60'
                  )}
                  aria-haspopup="menu"
                  aria-expanded={toolsOpen}
                >
                  <Wrench className="h-4 w-4" />
                  Tools
                  <ChevronDown
                    className={cn('h-3 w-3 transition', toolsOpen && 'rotate-180')}
                  />
                </button>
                {toolsOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-56 rounded-md surface border border-border shadow-elev animate-scale-in p-1"
                  >
                    {tools.map((t) => {
                      const Icon = t.icon;
                      return (
                        <Link
                          key={t.href}
                          href={t.href}
                          onClick={() => setToolsOpen(false)}
                          className={cn(
                            'flex items-center gap-2 px-2.5 py-2 rounded-sm text-sm transition-colors',
                            isActive(t.href)
                              ? 'bg-surface-2 text-foreground'
                              : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {t.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {roleLabel && (
              <span
                className={cn(
                  'text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide',
                  user?.role === 'admin' &&
                    'bg-grad-primary text-primary-foreground',
                  user?.role === 'coach' &&
                    'bg-grad-accent text-accent-foreground',
                  (user?.role === 'user' || user?.role === 'pending_coach') &&
                    'bg-secondary text-secondary-foreground border border-border'
                )}
              >
                {user?.role === 'admin' && (
                  <Sparkles className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                )}
                {roleLabel}
              </span>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {user ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {primary.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const showUnread = isMessagesItem(item.href) && unread > 0;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium',
                    active
                      ? 'bg-grad-primary text-primary-foreground'
                      : 'text-foreground hover:bg-surface-2'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.name}</span>
                  {showUnread && (
                    <span className="text-[10px] font-semibold tabular bg-foreground/20 rounded-full px-1.5 py-0.5">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </Link>
              );
            })}

            {tools.length > 0 && (
              <>
                <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Tools
                </div>
                {tools.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {t.name}
                    </Link>
                  );
                })}
              </>
            )}

            <div className="pt-3">
              {user ? (
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  leftIcon={<LogOut className="h-4 w-4" />}
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" size="md" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">
                      Get started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
