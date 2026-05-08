'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import ExerciseLibrary from '@/components/workout/ExerciseLibrary';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Calendar,
  Loader2,
  Check,
  X,
} from 'lucide-react';

interface Exercise {
  _id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  description: string;
  instructions: string[];
  tips: string[];
}

interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  order: number;
}

interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  exercises: WorkoutExercise[];
  isRestDay: boolean;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function CustomPlanBuilder() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [planName, setPlanName] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0: Name, 1-7: Days, 8: Review
  const [weeklySchedule, setWeeklySchedule] = useState<WorkoutDay[]>(
    DAYS_OF_WEEK.map((day) => ({
      day,
      focus: '',
      duration: '45 min',
      exercises: [],
      isRestDay: false,
    }))
  );
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const hasCompleteProfile =
    user?.age &&
    user?.gender &&
    user?.height &&
    user?.weight &&
    user?.goal &&
    user?.experienceLevel;

  useEffect(() => {
    if (!authLoading && !hasCompleteProfile) {
      router.push('/profile');
    }
  }, [hasCompleteProfile, authLoading, router]);

  const currentDay = currentStep > 0 && currentStep < 8 ? weeklySchedule[currentStep - 1] : null;

  const handleAddExercise = (exercise: Exercise) => {
    if (!currentDay || currentStep === 0 || currentStep === 8) return;

    const newExercise: WorkoutExercise = {
      exerciseId: exercise._id,
      name: exercise.name,
      sets: 3,
      reps: '10-12',
      rest: '60s',
      notes: '',
      order: currentDay.exercises.length,
    };

    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[currentStep - 1].exercises.push(newExercise);
    setWeeklySchedule(updatedSchedule);

    // Add to selected exercises
    setSelectedExercises((prev) => new Set(prev).add(exercise._id));
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedSchedule = [...weeklySchedule];
    const removedExercise = updatedSchedule[dayIndex].exercises[exerciseIndex];
    updatedSchedule[dayIndex].exercises.splice(exerciseIndex, 1);

    // Re-order remaining exercises
    updatedSchedule[dayIndex].exercises.forEach((ex, i) => {
      ex.order = i;
    });

    setWeeklySchedule(updatedSchedule);

    // Remove from selected exercises if not used in other days
    const isUsedElsewhere = weeklySchedule.some(
      (day, i) =>
        i !== dayIndex &&
        day.exercises.some((ex) => ex.exerciseId === removedExercise.exerciseId)
    );
    if (!isUsedElsewhere) {
      setSelectedExercises((prev) => {
        const newSet = new Set(prev);
        newSet.delete(removedExercise.exerciseId);
        return newSet;
      });
    }
  };

  const updateExercise = (
    dayIndex: number,
    exerciseIndex: number,
    field: keyof WorkoutExercise,
    value: any
  ) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].exercises[exerciseIndex] = {
      ...updatedSchedule[dayIndex].exercises[exerciseIndex],
      [field]: value,
    };
    setWeeklySchedule(updatedSchedule);
  };

  const updateDayInfo = (dayIndex: number, field: keyof WorkoutDay, value: any) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      [field]: value,
    };
    setWeeklySchedule(updatedSchedule);
  };

  const toggleRestDay = (dayIndex: number) => {
    const updatedSchedule = [...weeklySchedule];
    updatedSchedule[dayIndex].isRestDay = !updatedSchedule[dayIndex].isRestDay;
    if (updatedSchedule[dayIndex].isRestDay) {
      updatedSchedule[dayIndex].exercises = [];
      updatedSchedule[dayIndex].focus = 'Rest & Recovery';
    }
    setWeeklySchedule(updatedSchedule);
  };

  const handleSavePlan = async () => {
    if (!planName.trim()) {
      setError('Please enter a plan name');
      setCurrentStep(0);
      return;
    }

    // Validate at least one day has exercises
    const hasExercises = weeklySchedule.some((day) => day.exercises.length > 0);
    if (!hasExercises) {
      setError('Please add exercises to at least one day');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/workout-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: planName,
          weeklySchedule,
          generalNotes: 'Custom workout plan created by user',
          nutritionTips: '',
          isActive: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save workout plan');
      }

      router.push('/workout-plan');
    } catch (err: any) {
      setError(err.message || 'Failed to save workout plan');
    } finally {
      setSaving(false);
    }
  };

  const canGoNext = () => {
    if (currentStep === 0) return planName.trim().length > 0;
    if (currentStep >= 1 && currentStep <= 7) {
      const day = weeklySchedule[currentStep - 1];
      return day.isRestDay || (day.focus && day.exercises.length > 0);
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/workout-plan')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Custom Plan Builder</h1>
              <p className="text-muted-foreground">
                Create your personalized workout plan step by step
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of 9
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentStep + 1) / 9) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 9) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        {/* Step 0: Plan Name */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Name Your Workout Plan</CardTitle>
              <CardDescription>
                Give your custom workout plan a memorable name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder="e.g., Summer Shred 2024, Home Workout Routine..."
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                autoFocus
              />
            </CardContent>
          </Card>
        )}

        {/* Steps 1-7: Days */}
        {currentStep >= 1 && currentStep <= 7 && currentDay && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      {currentDay.day}
                    </CardTitle>
                    <CardDescription>Configure this day&apos;s workout</CardDescription>
                  </div>
                  <Button
                    variant={currentDay.isRestDay ? 'primary' : 'outline'}
                    onClick={() => toggleRestDay(currentStep - 1)}
                    size="sm"
                  >
                    {currentDay.isRestDay ? 'Training Day' : 'Rest Day'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!currentDay.isRestDay && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Focus Area</label>
                      <input
                        type="text"
                        placeholder="e.g., Upper Body, Legs, Full Body..."
                        value={currentDay.focus}
                        onChange={(e) => updateDayInfo(currentStep - 1, 'focus', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration</label>
                      <select
                        value={currentDay.duration}
                        onChange={(e) =>
                          updateDayInfo(currentStep - 1, 'duration', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="30 min">30 minutes</option>
                        <option value="45 min">45 minutes</option>
                        <option value="60 min">60 minutes</option>
                        <option value="75 min">75 minutes</option>
                        <option value="90 min">90 minutes</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentDay.isRestDay ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Rest Day</h3>
                    <p className="text-muted-foreground">
                      Recovery is essential for muscle growth and preventing injury
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Selected Exercises */}
                    {currentDay.exercises.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-3">Selected Exercises</h3>
                        <div className="space-y-3">
                          {currentDay.exercises.map((exercise, exerciseIndex) => (
                            <div
                              key={exerciseIndex}
                              className="p-4 border border-border rounded-lg bg-muted/30"
                            >
                              <div className="flex items-start gap-3">
                                <GripVertical className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{exercise.name}</h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleRemoveExercise(currentStep - 1, exerciseIndex)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-xs text-muted-foreground">Sets</label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={exercise.sets}
                                        onChange={(e) =>
                                          updateExercise(
                                            currentStep - 1,
                                            exerciseIndex,
                                            'sets',
                                            parseInt(e.target.value)
                                          )
                                        }
                                        className="w-full px-2 py-1 rounded border border-border bg-background text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">Reps</label>
                                      <input
                                        type="text"
                                        value={exercise.reps}
                                        onChange={(e) =>
                                          updateExercise(
                                            currentStep - 1,
                                            exerciseIndex,
                                            'reps',
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-2 py-1 rounded border border-border bg-background text-sm"
                                        placeholder="10-12"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">Rest</label>
                                      <input
                                        type="text"
                                        value={exercise.rest}
                                        onChange={(e) =>
                                          updateExercise(
                                            currentStep - 1,
                                            exerciseIndex,
                                            'rest',
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-2 py-1 rounded border border-border bg-background text-sm"
                                        placeholder="60s"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-xs text-muted-foreground">
                                      Notes (optional)
                                    </label>
                                    <input
                                      type="text"
                                      value={exercise.notes || ''}
                                      onChange={(e) =>
                                        updateExercise(
                                          currentStep - 1,
                                          exerciseIndex,
                                          'notes',
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-2 py-1 rounded border border-border bg-background text-sm"
                                      placeholder="Form tips, tempo, etc."
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exercise Library */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add Exercises
                      </h3>
                      <ExerciseLibrary
                        onAddExercise={handleAddExercise}
                        selectedExercises={selectedExercises}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 8: Review */}
        {currentStep === 8 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Plan</CardTitle>
              <CardDescription>
                Review and confirm your custom workout plan before saving
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Plan Name</h3>
                  <p className="text-lg">{planName}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Weekly Schedule</h3>
                  <div className="space-y-3">
                    {weeklySchedule.map((day, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{day.day}</h4>
                          {day.isRestDay ? (
                            <span className="text-sm text-green-500">Rest Day</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {day.focus} • {day.duration}
                            </span>
                          )}
                        </div>
                        {!day.isRestDay && day.exercises.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''}:{' '}
                            {day.exercises.map((ex) => ex.name).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || saving}
          >
            Previous
          </Button>

          <div className="flex gap-3">
            {currentStep === 8 ? (
              <Button onClick={handleSavePlan} size="lg" disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving Plan...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Plan
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} size="lg" disabled={!canGoNext()}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
