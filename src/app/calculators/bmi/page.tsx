'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Activity, ArrowLeft, Calculator, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface BMIResult {
  bmi: number;
  category: string;
  healthStatus: string;
  interpretation: string;
}

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!weight || !height) {
        throw new Error('Please enter both weight and height');
      }

      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);

      if (weightNum <= 0 || heightNum <= 0) {
        throw new Error('Please enter valid positive numbers');
      }

      const response = await fetch('/api/fitness/calculate-bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: weightNum,
          height: heightNum,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate BMI');
      }

      // Extract result from API response and add missing fields
      const bmiResult = data.result;
      setResult({
        bmi: bmiResult.bmi,
        category: bmiResult.category,
        healthStatus: bmiResult.healthy ? 'Healthy Range' : 'Outside Healthy Range',
        interpretation: getInterpretation(bmiResult.category)
      });
    } catch (err: any) {
      setError(err.message || 'Failed to calculate BMI');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setResult(null);
    setError('');
  };

  const getInterpretation = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'underweight':
        return 'You may be underweight for your height. Consider consulting a healthcare provider or nutritionist to develop a healthy weight gain plan.';
      case 'normal weight':
        return 'You are within a healthy weight range for your height. Maintain your current lifestyle with regular exercise and balanced nutrition.';
      case 'overweight':
        return 'You are above the healthy weight range. Consider adopting a balanced diet and regular exercise routine to achieve a healthier weight.';
      case 'obese':
        return 'You are significantly above the healthy weight range. We recommend consulting with a healthcare provider to create a personalized health plan.';
      default:
        return 'BMI calculated successfully.';
    }
  };

  const getCategoryColor = (category: string | undefined) => {
    if (!category) {
      return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }

    switch (category.toLowerCase()) {
      case 'underweight':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'normal weight':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'overweight':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'obese':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/calculators" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 animate-fade-in">
          <ArrowLeft className="h-4 w-4" />
          Back to Calculators
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">BMI Calculator</h1>
              <p className="text-muted-foreground">Calculate your Body Mass Index</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Enter Your Measurements
              </CardTitle>
              <CardDescription>Provide your weight and height for accurate results</CardDescription>
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
                  label="Weight (kg)"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  disabled={loading}
                  min="30"
                  max="300"
                  step="0.1"
                />

                <Input
                  type="number"
                  label="Height (cm)"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                  disabled={loading}
                  min="100"
                  max="300"
                  step="0.1"
                />

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate BMI'}
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
          {result ? (
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* BMI Value */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your BMI</p>
                  <p className="text-5xl font-bold text-foreground mb-4">{result.bmi}</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getCategoryColor(result.category)}`}>
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">{result.category}</span>
                  </div>
                </div>

                {/* Health Status */}
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold text-foreground mb-2">Health Status</h4>
                  <p className="text-sm text-muted-foreground">{result.healthStatus}</p>
                </div>

                {/* Interpretation */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">What This Means</h4>
                  <p className="text-sm text-muted-foreground">{result.interpretation}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>BMI Categories</CardTitle>
                <CardDescription>Understanding your BMI range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-blue-500">Underweight</span>
                      <span className="text-sm text-muted-foreground">&lt; 18.5</span>
                    </div>
                    <p className="text-xs text-muted-foreground">May indicate malnutrition</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-green-500">Normal Weight</span>
                      <span className="text-sm text-muted-foreground">18.5 - 24.9</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Healthy weight range</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-orange-500">Overweight</span>
                      <span className="text-sm text-muted-foreground">25 - 29.9</span>
                    </div>
                    <p className="text-xs text-muted-foreground">May increase health risks</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-red-500">Obese</span>
                      <span className="text-sm text-muted-foreground">≥ 30</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Higher health risk</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Note: BMI is a screening tool and doesn't account for muscle mass, bone density, or body composition.
                </p>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Information Section */}
        <Card className="mt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>About BMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Body Mass Index (BMI) is a simple calculation using a person's height and weight. The
                formula is BMI = kg/m², where kg is a person's weight in kilograms and m² is their
                height in meters squared.
              </p>
              <p>
                BMI is a useful indicator of health at the population level. However, the distribution
                of fat on your body is more important than the amount, when assessing your disease
                risk. For this reason, your waist circumference is thought to be a better predictor of
                health risk than your BMI.
              </p>
              <p className="font-medium text-foreground">
                BMI has limitations and should be used alongside other health assessments. Always
                consult with a healthcare professional for personalized advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
