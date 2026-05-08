'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Activity, Flame, Target, Droplet, Calculator, ArrowRight, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CalcCard {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  features: string[];
}

const CALCULATORS: CalcCard[] = [
  {
    title: 'BMI',
    description: 'Body mass index and weight classification.',
    icon: Activity,
    href: '/calculators/bmi',
    features: ['Weight class', 'Health status', 'Interpretation'],
  },
  {
    title: 'Calories',
    description: 'Daily caloric needs based on lifestyle and goals.',
    icon: Flame,
    href: '/calculators/calorie',
    features: ['BMR', 'Maintenance', 'Cut / bulk targets'],
  },
  {
    title: 'Macros',
    description: 'Protein, carb, and fat split for your goal.',
    icon: Target,
    href: '/calculators/macros',
    features: ['Protein', 'Carbs', 'Fats'],
  },
  {
    title: 'Water',
    description: 'How much water you should drink daily.',
    icon: Droplet,
    href: '/calculators/water',
    features: ['Hydration target', 'Activity boost', 'Guidelines'],
  },
];

export default function CalculatorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero */}
      <Card variant="hero" className="p-0">
        <div className="relative bg-dot-grid">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_350px_at_100%_0%,hsl(190_85%_60%/0.3),transparent_60%)]" />
          <div className="relative px-6 py-7 sm:px-10 sm:py-9">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/15">
              <Sparkles className="h-3 w-3" />
              Science-based formulas
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Fitness calculators
            </h1>
            <p className="mt-2 text-white/70 max-w-xl">
              Quick, accurate maths for body composition, calories, macros, and hydration.
              Backed by Mifflin-St Jeor and the same formulas dietitians use.
            </p>
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CALCULATORS.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href}>
              <Card hover className="h-full group flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-md bg-grad-primary flex items-center justify-center shadow-glow">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {c.description}
                  </p>
                </div>
                <ul className="space-y-1.5 mt-auto pt-3 border-t border-border/60">
                  {c.features.map((f) => (
                    <li
                      key={f}
                      className="text-xs text-muted-foreground flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-grad-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Tips */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
            <Calculator className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold">For accurate results</h2>
            <p className="text-xs text-muted-foreground">
              Four habits that keep your numbers honest.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              n: 1,
              title: 'Measure consistently',
              copy: 'Same time of day, ideally morning before eating.',
            },
            {
              n: 2,
              title: 'Be honest about activity',
              copy: 'Most people overestimate. When in doubt, pick a level lower.',
            },
            {
              n: 3,
              title: 'Recalculate every 4–6 weeks',
              copy: 'Your numbers shift as your body composition does.',
            },
            {
              n: 4,
              title: 'Treat outputs as guidelines',
              copy: 'Listen to your body. Adjust based on energy and recovery.',
            },
          ].map((t) => (
            <div key={t.n} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-md bg-grad-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-glow">
                {t.n}
              </span>
              <div>
                <h4 className="font-semibold text-sm">{t.title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">{t.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
