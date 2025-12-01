'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Target, ArrowLeft, Calculator, Beef, Cookie, Droplet as Oil, AlertCircle } from 'lucide-react';

interface MacroResult {
  protein: number;
  carbs: number;
  fats: number;
  proteinCalories: number;
  carbsCalories: number;
  fatsCalories: number;
}

export default function MacroCalculatorPage() {
  const [targetCalories, setTargetCalories] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MacroResult | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!targetCalories || !goal) {
        throw new Error('Please fill in all fields');
      }

      const calories = parseFloat(targetCalories);

      if (calories <= 0) {
        throw new Error('Please enter a valid calorie amount');
      }

      // Calculate macros based on goal (client-side calculation)
      let proteinPercent = 0.3;
      let carbsPercent = 0.4;
      let fatsPercent = 0.3;

      switch (goal) {
        case 'lose_weight':
          proteinPercent = 0.35;
          carbsPercent = 0.35;
          fatsPercent = 0.3;
          break;
        case 'build_muscle':
          proteinPercent = 0.3;
          carbsPercent = 0.45;
          fatsPercent = 0.25;
          break;
        case 'maintain_weight':
          proteinPercent = 0.3;
          carbsPercent = 0.4;
          fatsPercent = 0.3;
          break;
        case 'improve_endurance':
          proteinPercent = 0.25;
          carbsPercent = 0.5;
          fatsPercent = 0.25;
          break;
      }

      const proteinCalories = calories * proteinPercent;
      const carbsCalories = calories * carbsPercent;
      const fatsCalories = calories * fatsPercent;

      const protein = Math.round(proteinCalories / 4); // 4 calories per gram
      const carbs = Math.round(carbsCalories / 4); // 4 calories per gram
      const fats = Math.round(fatsCalories / 9); // 9 calories per gram

      setResult({
        protein,
        carbs,
        fats,
        proteinCalories: Math.round(proteinCalories),
        carbsCalories: Math.round(carbsCalories),
        fatsCalories: Math.round(fatsCalories),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to calculate macros');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTargetCalories('');
    setGoal('');
    setResult(null);
    setError('');
  };

  const goalOptions = [
    { value: '', label: 'Select Your Goal' },
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'build_muscle', label: 'Build Muscle' },
    { value: 'maintain_weight', label: 'Maintain Weight' },
    { value: 'improve_endurance', label: 'Improve Endurance' },
  ];

  const getPercentage = (macroCalories: number) => {
    if (!result) return 0;
    const total = result.proteinCalories + result.carbsCalories + result.fatsCalories;
    return Math.round((macroCalories / total) * 100);
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
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Macro Calculator</h1>
              <p className="text-muted-foreground">Calculate your macronutrient distribution</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Your Target
              </CardTitle>
              <CardDescription>Enter your daily calorie target and fitness goal</CardDescription>
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
                  label="Target Daily Calories"
                  placeholder="2000"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  required
                  disabled={loading}
                  min="800"
                  max="6000"
                />

                <Select
                  label="Fitness Goal"
                  options={goalOptions}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                  disabled={loading}
                />

                <div className="pt-2 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Not sure about your calorie target? Use our{' '}
                    <Link href="/calculators/calorie" className="text-primary hover:underline font-medium">
                      Calorie Calculator
                    </Link>
                    {' '}first.
                  </p>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? 'Calculating...' : 'Calculate Macros'}
                    </Button>
                    {result && (
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
          {result ? (
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Your Macro Distribution</CardTitle>
                <CardDescription>Daily macronutrient targets in grams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center">
                        <Beef className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="font-semibold text-foreground">Protein</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-500">{result.protein}g</p>
                      <p className="text-xs text-muted-foreground">{getPercentage(result.proteinCalories)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getPercentage(result.proteinCalories)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.proteinCalories} calories from protein (4 cal/g)
                  </p>
                </div>

                {/* Carbs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                        <Cookie className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="font-semibold text-foreground">Carbohydrates</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-500">{result.carbs}g</p>
                      <p className="text-xs text-muted-foreground">{getPercentage(result.carbsCalories)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getPercentage(result.carbsCalories)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.carbsCalories} calories from carbs (4 cal/g)
                  </p>
                </div>

                {/* Fats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                        <Oil className="h-4 w-4 text-orange-500" />
                      </div>
                      <span className="font-semibold text-foreground">Fats</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">{result.fats}g</p>
                      <p className="text-xs text-muted-foreground">{getPercentage(result.fatsCalories)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getPercentage(result.fatsCalories)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.fatsCalories} calories from fats (9 cal/g)
                  </p>
                </div>

                {/* Summary */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    Total: <span className="font-semibold text-foreground">{targetCalories} calories/day</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>About Macronutrients</CardTitle>
                <CardDescription>Understanding protein, carbs, and fats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Beef className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold text-foreground">Protein</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Essential for muscle growth and repair. Aim for 0.8-2.2g per kg of body weight
                    depending on activity level and goals. 4 calories per gram.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Cookie className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold text-foreground">Carbohydrates</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Primary energy source for high-intensity exercise. Choose complex carbs for
                    sustained energy. 4 calories per gram.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Oil className="h-5 w-5 text-orange-500" />
                    <h4 className="font-semibold text-foreground">Fats</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Crucial for hormone production and nutrient absorption. Focus on healthy fats from
                    nuts, fish, and oils. 9 calories per gram.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Goal-Specific Recommendations */}
        <Card className="mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Macro Ratios by Goal</CardTitle>
            <CardDescription>Common macronutrient distributions for different fitness goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">Weight Loss</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="font-medium text-red-500">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="font-medium text-blue-500">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fats:</span>
                    <span className="font-medium text-orange-500">30%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">Build Muscle</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="font-medium text-red-500">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="font-medium text-blue-500">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fats:</span>
                    <span className="font-medium text-orange-500">25%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">Maintenance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="font-medium text-red-500">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="font-medium text-blue-500">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fats:</span>
                    <span className="font-medium text-orange-500">30%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">Endurance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="font-medium text-red-500">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="font-medium text-blue-500">50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fats:</span>
                    <span className="font-medium text-orange-500">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
