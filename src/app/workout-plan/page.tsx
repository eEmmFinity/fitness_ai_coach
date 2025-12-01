'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Timer } from '@/components/workout/Timer';
import { Dumbbell, Calendar, Clock, Repeat, Zap, Loader2, RefreshCw, Info, CheckCircle2, Circle, TrendingUp, RotateCcw } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  weeklySchedule: WorkoutDay[];
  generalNotes: string;
  nutritionTips: string;
}

export default function WorkoutPlanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const hasCompleteProfile = user?.age && user?.gender && user?.height && user?.weight && user?.goal && user?.experienceLevel;

  // Load workout progress from localStorage
  useEffect(() => {
    if (workoutPlan) {
      const savedProgress = localStorage.getItem('workoutProgress');
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          setCompletedExercises(new Set(progress.completedExercises || []));
          setWorkoutDuration(progress.duration || 0);
        } catch (e) {
          console.error('Failed to load workout progress:', e);
        }
      }
    }
  }, [workoutPlan]);

  // Save workout progress to localStorage
  useEffect(() => {
    if (workoutPlan && (completedExercises.size > 0 || workoutDuration > 0)) {
      const progress = {
        completedExercises: Array.from(completedExercises),
        duration: workoutDuration,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('workoutProgress', JSON.stringify(progress));
    }
  }, [completedExercises, workoutDuration, workoutPlan]);

  const toggleExerciseCompletion = (dayIndex: number, exerciseIndex: number) => {
    const exerciseId = `${dayIndex}-${exerciseIndex}`;
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const isExerciseCompleted = (dayIndex: number, exerciseIndex: number): boolean => {
    return completedExercises.has(`${dayIndex}-${exerciseIndex}`);
  };

  const getDayProgress = (dayIndex: number): number => {
    if (!workoutPlan) return 0;
    const day = workoutPlan.weeklySchedule[dayIndex];
    if (!day) return 0;

    const totalExercises = day.exercises.length;
    const completedCount = day.exercises.filter((_, i) =>
      isExerciseCompleted(dayIndex, i)
    ).length;

    return Math.round((completedCount / totalExercises) * 100);
  };

  const resetWorkoutProgress = () => {
    setCompletedExercises(new Set());
    setWorkoutDuration(0);
    localStorage.removeItem('workoutProgress');
  };

  const generateWorkoutPlan = async () => {
    if (!hasCompleteProfile) {
      setError('Please complete your profile first to generate a personalized workout plan');
      router.push('/profile');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/fitness/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate workout plan');
      }

      setWorkoutPlan(data.workoutPlan);
    } catch (err: any) {
      setError(err.message || 'Failed to generate workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Workout Plan Generator</h1>
              <p className="text-muted-foreground">
                Get a personalized weekly workout routine based on your goals
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!workoutPlan && (
          <Card className="animate-slide-up mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Ready for Your Personalized Plan?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {hasCompleteProfile
                    ? 'Generate a customized workout routine tailored to your fitness goals, experience level, and lifestyle.'
                    : 'Complete your profile first to receive a personalized workout plan designed just for you.'}
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm max-w-md mx-auto">
                    {error}
                  </div>
                )}

                <Button
                  onClick={generateWorkoutPlan}
                  size="lg"
                  className="gap-2"
                  disabled={loading || !hasCompleteProfile}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      {hasCompleteProfile ? 'Generate My Workout Plan' : 'Complete Profile First'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Plan Display */}
        {workoutPlan && (
          <div className="space-y-6">
            {/* Timer and Action Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
              <div className="lg:col-span-2">
                <Timer onTimeUpdate={setWorkoutDuration} />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={resetWorkoutProgress}
                  variant="outline"
                  className="gap-2 flex-1"
                  disabled={completedExercises.size === 0 && workoutDuration === 0}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Progress
                </Button>
                <Button onClick={generateWorkoutPlan} variant="outline" className="gap-2 flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      New Plan
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="grid grid-cols-1 gap-6">
              {workoutPlan.weeklySchedule.map((day, dayIndex) => (
                <Card
                  key={dayIndex}
                  className="animate-slide-up"
                  style={{ animationDelay: `${dayIndex * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl">{day.day}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            <span className="font-medium text-foreground">{day.focus}</span>
                            <span className="mx-2">•</span>
                            <Clock className="inline h-4 w-4 mr-1" />
                            {day.duration}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-primary">
                            {getDayProgress(dayIndex)}%
                          </span>
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${getDayProgress(dayIndex)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.exercises.map((exercise, exerciseIndex) => {
                        const isCompleted = isExerciseCompleted(dayIndex, exerciseIndex);
                        return (
                          <div
                            key={exerciseIndex}
                            className={`p-4 rounded-lg border transition-all cursor-pointer ${
                              isCompleted
                                ? 'border-green-500 bg-green-500/5'
                                : 'border-border hover:border-primary'
                            }`}
                            onClick={() => toggleExerciseCompletion(dayIndex, exerciseIndex)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExerciseCompletion(dayIndex, exerciseIndex);
                                  }}
                                  className="flex-shrink-0"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                  ) : (
                                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                                  )}
                                </button>
                                <h4
                                  className={`font-semibold text-lg ${
                                    isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                                  }`}
                                >
                                  {exercise.name}
                                </h4>
                              </div>
                            </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center">
                                <Repeat className="h-4 w-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-muted-foreground">Sets</p>
                                <p className="font-medium text-foreground">{exercise.sets}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center">
                                <Zap className="h-4 w-4 text-green-500" />
                              </div>
                              <div>
                                <p className="text-muted-foreground">Reps</p>
                                <p className="font-medium text-foreground">{exercise.reps}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-orange-500/10 rounded flex items-center justify-center">
                                <Clock className="h-4 w-4 text-orange-500" />
                              </div>
                              <div>
                                <p className="text-muted-foreground">Rest</p>
                                <p className="font-medium text-foreground">{exercise.rest}</p>
                              </div>
                            </div>
                          </div>
                          {exercise.notes && (
                            <div className="mt-3 p-2 bg-muted rounded text-sm text-muted-foreground">
                              <Info className="inline h-4 w-4 mr-1" />
                              {exercise.notes}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* General Notes & Nutrition Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workoutPlan.generalNotes && (
                <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      General Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {workoutPlan.generalNotes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {workoutPlan.nutritionTips && (
                <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Nutrition Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {workoutPlan.nutritionTips}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
