'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Flame, ArrowLeft, Calculator, TrendingDown, Minus, TrendingUp, AlertCircle } from 'lucide-react';

interface CalorieResult {
  bmr: number;
  maintenance: number;
  weightLoss: number;
  extremeWeightLoss: number;
  weightGain: number;
}

export default function CalorieCalculatorPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    lifestyle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.weight || !formData.height || !formData.age || !formData.gender || !formData.lifestyle) {
        throw new Error('Please fill in all fields');
      }

      const response = await fetch('/api/fitness/calculate-calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          age: parseInt(formData.age),
          gender: formData.gender,
          lifestyle: formData.lifestyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate calories');
      }

      // Extract calories from API response
      setResult({
        bmr: data.calories.bmr,
        maintenance: data.calories.maintenance,
        weightLoss: data.calories.weightLoss,
        extremeWeightLoss: Math.round(data.calories.maintenance * 0.70), // 30% deficit
        weightGain: data.calories.weightGain
      });
    } catch (err: any) {
      setError(err.message || 'Failed to calculate calories');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      weight: '',
      height: '',
      age: '',
      gender: '',
      lifestyle: '',
    });
    setResult(null);
    setError('');
  };

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const lifestyleOptions = [
    { value: '', label: 'Select Activity Level' },
    { value: 'sedentary', label: 'Sedentary (Little to no exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely Active (Athlete)' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/calculators" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 animate-fade-in">
          <ArrowLeft className="h-4 w-4" />
          Back to Calculators
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Calorie Calculator</h1>
              <p className="text-muted-foreground">Calculate your daily caloric needs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Card */}
          <Card className="lg:col-span-1 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Your Information
              </CardTitle>
              <CardDescription>Enter your details for accurate calculation</CardDescription>
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
                  name="weight"
                  label="Weight (kg)"
                  placeholder="70"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min="30"
                  max="300"
                  step="0.1"
                />

                <Input
                  type="number"
                  name="height"
                  label="Height (cm)"
                  placeholder="175"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min="100"
                  max="300"
                  step="0.1"
                />

                <Input
                  type="number"
                  name="age"
                  label="Age"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min="13"
                  max="120"
                />

                <Select
                  name="gender"
                  label="Gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <Select
                  name="lifestyle"
                  label="Activity Level"
                  options={lifestyleOptions}
                  value={formData.lifestyle}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate'}
                  </Button>
                  {result && (
                    <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
                      Reset
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Card */}
          <div className="lg:col-span-2 space-y-6">
            {result ? (
              <>
                <Card className="animate-slide-up">
                  <CardHeader>
                    <CardTitle>Your Daily Caloric Needs</CardTitle>
                    <CardDescription>Based on your activity level and body composition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* BMR */}
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Flame className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Basal Metabolic Rate</p>
                            <p className="text-2xl font-bold text-blue-500">{Math.round(result.bmr)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Calories burned at complete rest
                        </p>
                      </div>

                      {/* Maintenance */}
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <Minus className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Maintenance</p>
                            <p className="text-2xl font-bold text-green-500">{Math.round(result.maintenance)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Calories to maintain current weight
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Goal-Based Calories */}
                <Card className="animate-slide-up">
                  <CardHeader>
                    <CardTitle>Goal-Based Calorie Targets</CardTitle>
                    <CardDescription>Adjust your intake based on your fitness goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Weight Loss */}
                      <div className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                              <TrendingDown className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Mild Weight Loss</p>
                              <p className="text-sm text-muted-foreground">0.25 kg per week</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-500">{Math.round(result.weightLoss)}</p>
                            <p className="text-xs text-muted-foreground">calories/day</p>
                          </div>
                        </div>
                      </div>

                      {/* Extreme Weight Loss */}
                      <div className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                              <TrendingDown className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Weight Loss</p>
                              <p className="text-sm text-muted-foreground">0.5 kg per week</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-500">{Math.round(result.extremeWeightLoss)}</p>
                            <p className="text-xs text-muted-foreground">calories/day</p>
                          </div>
                        </div>
                      </div>

                      {/* Weight Gain */}
                      <div className="p-4 rounded-lg border border-border hover:border-primary transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Weight Gain</p>
                              <p className="text-sm text-muted-foreground">0.25 kg per week</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-500">{Math.round(result.weightGain)}</p>
                            <p className="text-xs text-muted-foreground">calories/day</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>Understanding your calorie needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Basal Metabolic Rate (BMR)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your BMR is the number of calories your body burns at complete rest. It's
                        calculated using the Mifflin-St Jeor equation, which considers your weight,
                        height, age, and gender.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-primary" />
                        Total Daily Energy Expenditure (TDEE)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your TDEE (maintenance calories) is your BMR multiplied by an activity factor
                        based on your lifestyle. This represents the calories you burn throughout a
                        typical day including all activities.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                        Creating a Calorie Deficit
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        To lose weight, you need to consume fewer calories than you burn. A deficit of
                        250 calories per day results in approximately 0.25 kg weight loss per week,
                        while 500 calories creates 0.5 kg loss per week.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Creating a Calorie Surplus
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        To gain weight or build muscle, consume more calories than you burn. A surplus
                        of 250-500 calories per day, combined with resistance training, supports muscle
                        growth.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
