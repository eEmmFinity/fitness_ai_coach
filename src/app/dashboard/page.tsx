'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressSection } from '@/components/dashboard/ProgressSection';
import { VerifyEmailBanner } from '@/components/dashboard/VerifyEmailBanner';
import { CoachApplicationBanner } from '@/components/dashboard/CoachApplicationBanner';
import Link from 'next/link';
import {
  Activity,
  TrendingUp,
  Target,
  Flame,
  Droplet,
  ArrowRight,
  Plus,
  Camera,
  Sparkles,
  MessageSquare,
  Calculator,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // Role-first routing: coaches and admins have their own home pages
    if (user.role === 'coach') router.replace('/coach');
    else if (user.role === 'admin') router.replace('/admin');
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role === 'coach' || user.role === 'admin') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
      </div>
    );
  }

  const hasCompleteProfile =
    user.age && user.gender && user.height && user.weight && user.goal;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return 'Up early';
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const stats = [
    {
      icon: Activity,
      label: 'BMI',
      value: user.bmi ? user.bmi.toFixed(1) : '–',
    },
    {
      icon: Flame,
      label: 'Daily kcal',
      value: user.maintenanceCalories ?? '–',
    },
    {
      icon: TrendingUp,
      label: 'Weight',
      value: user.weight ? `${user.weight} kg` : '–',
    },
    {
      icon: Target,
      label: 'Goal',
      value: user.goal ? user.goal.replace('_', ' ') : '–',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banners */}
        {user.emailVerified === false && <VerifyEmailBanner email={user.email} />}
        <CoachApplicationBanner
          initialRole={user.role}
          onChange={() => router.refresh()}
        />

        {/* Hero — single gradient surface, big greeting, primary CTA */}
        <Card variant="hero" className="p-0 animate-slide-up">
          <div className="relative bg-dot-grid">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(800px_400px_at_100%_0%,hsl(190_85%_60%/0.3),transparent_60%)]" />
            <div className="relative px-6 py-8 sm:px-10 sm:py-12 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/15">
                  <Sparkles className="h-3 w-3" />
                  {greeting}
                </span>
                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  Welcome back, {user.name.split(' ')[0]}
                </h1>
                <p className="mt-2 text-white/70 max-w-xl">
                  {hasCompleteProfile
                    ? 'Your form, your numbers, your day. Pick something below to get moving.'
                    : 'Tell us about you and unlock personalized routines, calorie targets, and AI coaching.'}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/live-workout">
                    <Button
                      variant="accent"
                      size="lg"
                      leftIcon={<Camera className="h-4 w-4" />}
                    >
                      Start live workout
                    </Button>
                  </Link>
                  {!hasCompleteProfile && (
                    <Link href="/profile">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/15"
                        leftIcon={<Plus className="h-4 w-4" />}
                      >
                        Complete profile
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Inline stat row inside the hero — minimal, glassy */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4 lg:min-w-[320px]">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="rounded-md bg-white/8 backdrop-blur-sm border border-white/15 px-3.5 py-3"
                    >
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/60">
                        <Icon className="h-3.5 w-3.5" />
                        {s.label}
                      </div>
                      <div className="mt-1 text-xl font-semibold text-white tabular capitalize">
                        {s.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Progress — charts */}
        <ProgressSection />

        {/* Quick actions row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <Link href="/workout-plan" className="group">
            <Card hover className="h-full animate-slide-up">
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-md bg-grad-primary flex items-center justify-center shadow-glow">
                  <Activity className="h-5 w-5 text-white" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Workout plan</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Generate or follow your personalised routine.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
              </div>
            </Card>
          </Link>

          <Link href="/ai-coach" className="group">
            <Card hover className="h-full animate-slide-up">
              <div className="flex items-start gap-4">
                <span className="w-10 h-10 rounded-md bg-grad-accent flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent-foreground" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-base flex items-center gap-1.5">
                    AI coach
                    <span className="text-[10px] font-bold uppercase tracking-wider text-grad-accent">
                      Pro
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Ask anything about training, nutrition, or recovery.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Calculators */}
        <div className="animate-slide-up">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Fitness calculators
              </h2>
              <p className="text-sm text-muted-foreground">
                Quick maths for body, calories, macros, and hydration.
              </p>
            </div>
            <Link
              href="/calculators"
              className="text-sm text-primary hover:underline hidden sm:inline-flex items-center gap-1"
            >
              All calculators <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {[
              { href: '/calculators/bmi', icon: Activity, title: 'BMI', desc: 'Body mass index' },
              { href: '/calculators/calorie', icon: Flame, title: 'Calories', desc: 'Daily intake' },
              { href: '/calculators/macros', icon: Calculator, title: 'Macros', desc: 'P/C/F split' },
              { href: '/calculators/water', icon: Droplet, title: 'Water', desc: 'Hydration target' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.href} href={c.href}>
                  <Card hover variant="default" className="h-full">
                    <Icon className="h-5 w-5 text-grad-primary" />
                    <div className="mt-3 font-semibold">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {c.desc}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
