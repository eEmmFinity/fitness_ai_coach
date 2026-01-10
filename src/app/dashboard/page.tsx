'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import {
  Activity,
  TrendingUp,
  Target,
  Flame,
  Droplet,
  Calendar,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasCompleteProfile = user.age && user.gender && user.height && user.weight && user.goal;

  const statsCards = [
    {
      icon: Activity,
      label: 'BMI',
      value: user.bmi ? user.bmi.toFixed(1) : '--',
      suffix: '',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Flame,
      label: 'Daily Calories',
      value: user.maintenanceCalories || '--',
      suffix: 'kcal',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Weight',
      value: user.weight || '--',
      suffix: 'kg',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Target,
      label: 'Goal',
      value: user.goal ? user.goal.replace('_', ' ') : '--',
      suffix: '',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            {hasCompleteProfile
              ? "Here's your fitness overview"
              : 'Complete your profile to get personalized recommendations'}
          </p>
        </div>

        {/* Profile Incomplete Alert */}
        {!hasCompleteProfile && (
          <Card className="mb-8 border-primary/50 bg-primary/5 animate-slide-up">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add your personal details to unlock personalized workout routines, calorie
                    calculations, and AI-powered fitness recommendations.
                  </p>
                  <Link href="/profile">
                    <Button size="sm" className="gap-2">
                      Complete Profile
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                hover
                className="animate-slide-up"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                    {stat.suffix && <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card hover className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Workout Plan</CardTitle>
                  <CardDescription>Get your personalized routine</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate a customized workout plan based on your goals, experience level, and
                available equipment.
              </p>
              <Link href="/workout-plan">
                <Button className="w-full gap-2">
                  View Workout Plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card hover className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>AI Fitness Coach</CardTitle>
                  <CardDescription>Get instant expert advice</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Chat with our AI assistant for personalized advice on workouts, nutrition, and
                fitness strategies.
              </p>
              <Link href="/ai-coach">
                <Button className="w-full gap-2" variant="secondary">
                  Chat with AI Coach
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Calculators Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Fitness Calculators</CardTitle>
            <CardDescription>Track your metrics and optimize your nutrition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/calculators/bmi">
                <div className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer group">
                  <Activity className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-1">BMI Calculator</h4>
                  <p className="text-sm text-muted-foreground">Calculate body mass index</p>
                </div>
              </Link>
              <Link href="/calculators/calorie">
                <div className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer group">
                  <Flame className="h-6 w-6 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-1">Calorie Calculator</h4>
                  <p className="text-sm text-muted-foreground">Find your daily needs</p>
                </div>
              </Link>
              <Link href="/calculators/macros">
                <div className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer group">
                  <Target className="h-6 w-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-1">Macro Calculator</h4>
                  <p className="text-sm text-muted-foreground">Optimize your nutrition</p>
                </div>
              </Link>
              <Link href="/calculators/water">
                <div className="p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer group">
                  <Droplet className="h-6 w-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground mb-1">Water Intake</h4>
                  <p className="text-sm text-muted-foreground">Stay hydrated</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
