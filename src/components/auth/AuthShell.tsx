'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, Sparkles } from 'lucide-react';

interface AuthShellProps {
  side: 'login' | 'register';
  children: React.ReactNode;
}

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Pick up where you left off.',
    sub: 'Your form, your numbers, your AI coach — all in one place.',
  },
  register: {
    eyebrow: 'Get started',
    title: 'Train smarter from session one.',
    sub: 'Real-time form analysis, AI coaching, and progress that actually compounds.',
  },
};

const FEATURES = [
  'Live computer-vision form scoring',
  'AI coach in your pocket',
  '30-day progress, streaks, and trends',
  'Connect with verified coaches',
];

export function AuthShell({ side, children }: AuthShellProps) {
  const copy = COPY[side];
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Marketing pane */}
      <div className="relative hidden lg:block bg-grad-hero overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_0%_0%,hsl(190_85%_60%/0.35),transparent_60%)]" />

        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <Link href="/" className="inline-flex items-center gap-2.5 group w-fit">
            <span className="w-9 h-9 rounded-md bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <Dumbbell className="h-5 w-5 text-white" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              Fitness AI
            </span>
          </Link>

          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/15">
              <Sparkles className="h-3 w-3" />
              {copy.eyebrow}
            </span>
            <h1 className="mt-4 text-4xl xl:text-5xl font-bold tracking-tight leading-tight max-w-md">
              {copy.title}
            </h1>
            <p className="mt-3 text-white/75 max-w-md leading-relaxed">
              {copy.sub}
            </p>

            <ul className="mt-8 space-y-2.5">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-white/85"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Fitness AI Coach
          </p>
        </div>
      </div>

      {/* Form pane */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-12 py-10 lg:py-12">
        <div className="w-full max-w-md animate-slide-up">{children}</div>
      </div>
    </div>
  );
}
