'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Dumbbell, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface Exercise {
  _id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  caloriesPerRep: number;
  isCustom: boolean;
}

interface ExerciseLibraryProps {
  onAddExercise: (exercise: Exercise) => void;
  selectedExercises?: Set<string>;
}

export default function ExerciseLibrary({ onAddExercise, selectedExercises = new Set() }: ExerciseLibraryProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', 'strength', 'cardio', 'flexibility', 'sports'];
  const muscleGroups = [
    'all',
    'chest',
    'back',
    'legs',
    'shoulders',
    'arms',
    'core',
    'full body',
    'cardio',
  ];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchExercises();
  }, [searchTerm, selectedCategory, selectedMuscleGroup, selectedDifficulty]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedMuscleGroup !== 'all') params.append('muscleGroup', selectedMuscleGroup);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);

      const response = await fetch(`/api/exercises?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setExercises(data.exercises || []);
      }
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedMuscleGroup('all');
    setSelectedDifficulty('all');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    return '🏋️';
  };

  const isExerciseSelected = (exerciseId: string) => {
    return selectedExercises.has(exerciseId);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {(searchTerm || selectedCategory !== 'all' || selectedMuscleGroup !== 'all' || selectedDifficulty !== 'all') && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-border rounded-lg bg-muted/30">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Muscle Group</label>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Exercise List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No exercises found</p>
          <Button variant="ghost" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <Card
              key={exercise._id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isExerciseSelected(exercise._id)
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{exercise.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {exercise.muscleGroups.join(', ')}
                    </CardDescription>
                  </div>
                  <span className="text-2xl">{getCategoryIcon(exercise.category)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {exercise.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(
                      exercise.difficulty
                    )}`}
                  >
                    {exercise.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted">
                    {exercise.category}
                  </span>
                  {exercise.equipment.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full border border-border bg-muted">
                      {exercise.equipment.join(', ')}
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => onAddExercise(exercise)}
                  size="sm"
                  className="w-full"
                  variant={isExerciseSelected(exercise._id) ? 'secondary' : 'default'}
                  disabled={isExerciseSelected(exercise._id)}
                >
                  {isExerciseSelected(exercise._id) ? 'Added' : 'Add to Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
