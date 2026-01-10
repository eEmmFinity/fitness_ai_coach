'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Activity, Flame, Target, Droplet, Calculator, ArrowRight } from 'lucide-react';

export default function CalculatorsPage() {
  const calculators = [
    {
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and understand your body composition',
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/calculators/bmi',
      features: ['Weight classification', 'Health status', 'BMI interpretation'],
    },
    {
      title: 'Calorie Calculator',
      description: 'Determine your daily caloric needs based on your lifestyle and goals',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      href: '/calculators/calorie',
      features: ['BMR calculation', 'Maintenance calories', 'Weight loss/gain targets'],
    },
    {
      title: 'Macro Calculator',
      description: 'Find your optimal macronutrient distribution for your fitness goals',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      href: '/calculators/macros',
      features: ['Protein targets', 'Carb allocation', 'Healthy fats'],
    },
    {
      title: 'Water Intake Calculator',
      description: 'Calculate how much water you should drink daily to stay hydrated',
      icon: Droplet,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      href: '/calculators/water',
      features: ['Daily hydration needs', 'Activity adjustments', 'Health guidelines'],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Calculator className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Fitness Calculators</h1>
              <p className="text-muted-foreground">
                Track your metrics and optimize your nutrition with our suite of calculators
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8 animate-slide-up border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Science-Based Calculations
                </h3>
                <p className="text-muted-foreground">
                  Our calculators use scientifically proven formulas like Harris-Benedict and
                  Mifflin-St Jeor equations to provide accurate results. Use these tools to track
                  your progress, set realistic goals, and optimize your fitness journey.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {calculators.map((calc, index) => {
            const Icon = calc.icon;
            return (
              <Link key={index} href={calc.href}>
                <Card
                  hover
                  className="h-full animate-slide-up cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${calc.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-7 w-7 ${calc.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{calc.title}</CardTitle>
                    <CardDescription className="text-base">{calc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground mb-3">Features:</p>
                      <ul className="space-y-2">
                        {calc.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${calc.bgColor}`}></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="mt-8 animate-slide-up">
          <CardHeader>
            <CardTitle>Tips for Accurate Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  Measure Consistently
                </h4>
                <p className="text-sm text-muted-foreground">
                  Take measurements at the same time of day, preferably in the morning before
                  eating, for the most accurate results.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  Be Honest About Activity
                </h4>
                <p className="text-sm text-muted-foreground">
                  Choose your activity level honestly. Most people overestimate their activity
                  level, which can lead to inaccurate calorie calculations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  Track Your Progress
                </h4>
                <p className="text-sm text-muted-foreground">
                  Recalculate your metrics every 4-6 weeks as your body composition changes to
                  ensure your nutrition stays aligned with your goals.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">4</span>
                  </div>
                  Use as Guidelines
                </h4>
                <p className="text-sm text-muted-foreground">
                  These calculators provide estimates. Listen to your body and adjust based on your
                  actual progress and how you feel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
