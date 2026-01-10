'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import {
  Dumbbell,
  Brain,
  Calculator,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Coaching',
      description: 'Get personalized fitness advice from our intelligent AI assistant 24/7',
    },
    {
      icon: Dumbbell,
      title: 'Custom Workouts',
      description: 'Receive workout routines tailored to your goals, experience, and fitness level',
    },
    {
      icon: Calculator,
      title: 'Fitness Calculators',
      description: 'Track BMI, calories, macros, and water intake with precision tools',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your fitness journey with comprehensive dashboards and analytics',
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Science-based recommendations backed by fitness and nutrition expertise',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Workout plans that adapt to your busy lifestyle and time constraints',
    },
  ];

  const benefits = [
    'Personalized workout routines based on your goals',
    'AI chat assistant for instant fitness advice',
    'Comprehensive fitness and nutrition calculators',
    'Progress tracking and performance analytics',
    'Expert-designed programs for all fitness levels',
    'Dark mode support for comfortable viewing',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Your Personal
              <span className="text-primary block mt-2">AI Fitness Coach</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Transform your fitness journey with AI-powered coaching, personalized workout plans,
              and expert guidance tailored to your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="gap-2">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive fitness tools and AI-powered features designed to help you achieve
              your health and fitness goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  hover
                  className="text-center animate-slide-up"
                >
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Why Choose Fitness AI Coach?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform combines cutting-edge AI technology with proven fitness science
                to deliver a coaching experience that adapts to your unique needs and goals.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="animate-slide-up lg:animate-delay-200">
              <CardHeader>
                <CardTitle>Start Your Journey Today</CardTitle>
                <CardDescription>
                  Join thousands of users who have transformed their fitness with AI coaching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Create Your Profile</h4>
                      <p className="text-sm text-muted-foreground">
                        Tell us about your goals and fitness level
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Get Your Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive a personalized workout and nutrition plan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Achieve Results</h4>
                      <p className="text-sm text-muted-foreground">
                        Track progress and reach your fitness goals
                      </p>
                    </div>
                  </div>
                </div>
                <Link href="/register" className="block">
                  <Button size="lg" className="w-full gap-2">
                    Get Started Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Start your journey today with personalized AI coaching and achieve your goals faster
            than ever before.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
