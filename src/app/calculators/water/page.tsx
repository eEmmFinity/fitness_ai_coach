'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Droplet, ArrowLeft, Calculator, Activity, Sun, AlertCircle, Info } from 'lucide-react';

export default function WaterCalculatorPage() {
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waterIntake, setWaterIntake] = useState<number | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!weight) {
        throw new Error('Please enter your weight');
      }

      const weightNum = parseFloat(weight);

      if (weightNum <= 0) {
        throw new Error('Please enter a valid weight');
      }

      // Calculate water intake: 33ml per kg of body weight
      const intake = (weightNum * 33) / 1000; // Convert to liters
      setWaterIntake(parseFloat(intake.toFixed(2)));
    } catch (err: any) {
      setError(err.message || 'Failed to calculate water intake');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWeight('');
    setWaterIntake(null);
    setError('');
  };

  const getGlasses = (liters: number) => {
    // Standard glass is 250ml (0.25L)
    return Math.round(liters / 0.25);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/calculators" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 animate-fade-in">
          <ArrowLeft className="h-4 w-4" />
          Back to Calculators
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
              <Droplet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Water Intake Calculator</h1>
              <p className="text-muted-foreground">Calculate your daily hydration needs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Calculate Your Needs
              </CardTitle>
              <CardDescription>Enter your body weight for personalized hydration target</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <Input
                  type="number"
                  label="Body Weight (kg)"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  disabled={loading}
                  min="30"
                  max="300"
                  step="0.1"
                />

                <div className="pt-2 space-y-3">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        This calculation uses the standard recommendation of 33ml per kg of body weight.
                        Individual needs may vary based on activity level, climate, and health conditions.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Calculating...' : 'Calculate'}
                    </Button>
                    {waterIntake && (
                      <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Card */}
          {waterIntake ? (
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Your Daily Water Intake</CardTitle>
                <CardDescription>Recommended hydration target</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Result */}
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                  <Droplet className="h-12 w-12 text-cyan-500 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">Daily Water Intake</p>
                  <p className="text-5xl font-bold text-cyan-500 mb-1">{waterIntake}</p>
                  <p className="text-lg text-muted-foreground">liters per day</p>
                </div>

                {/* Alternative Measurements */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {getGlasses(waterIntake)}
                    </p>
                    <p className="text-sm text-muted-foreground">Glasses (250ml)</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted text-center">
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {Math.round(waterIntake * 1000)}
                    </p>
                    <p className="text-sm text-muted-foreground">Milliliters</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Hydration Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">•</span>
                      <span>Drink consistently throughout the day rather than all at once</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">•</span>
                      <span>Increase intake during exercise or hot weather</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">•</span>
                      <span>Monitor urine color - pale yellow indicates good hydration</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Why Hydration Matters</CardTitle>
                <CardDescription>The importance of staying hydrated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold text-foreground">Performance</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Proper hydration improves physical performance, endurance, and recovery. Even mild
                    dehydration can reduce exercise capacity.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="h-5 w-5 text-cyan-500" />
                    <h4 className="font-semibold text-foreground">Body Function</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Water regulates body temperature, transports nutrients, removes waste, and cushions
                    joints. It's essential for every cellular process.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="h-5 w-5 text-orange-500" />
                    <h4 className="font-semibold text-foreground">Energy & Focus</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dehydration causes fatigue, reduced concentration, and mood changes. Staying
                    hydrated keeps you alert and energized.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">When to Drink More</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Activity className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>During and after exercise (add 400-800ml per hour of activity)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sun className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>In hot or humid weather (increase by 25-50%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>When sick with fever, vomiting, or diarrhea</span>
                </li>
                <li className="flex items-start gap-2">
                  <Droplet className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span>If breastfeeding (additional 700ml daily)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg">Signs of Dehydration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Dark yellow or amber-colored urine</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Feeling thirsty or having a dry mouth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Headaches and dizziness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Fatigue and reduced energy levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Dry skin and reduced skin elasticity</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Important Note */}
        <Card className="mt-6 animate-slide-up border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Important Note</h4>
                <p className="text-sm text-muted-foreground">
                  This calculator provides general hydration guidelines based on body weight. Individual
                  water needs vary based on activity level, climate, health conditions, and diet.
                  Consult with a healthcare professional if you have specific hydration concerns or
                  medical conditions affecting fluid balance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
