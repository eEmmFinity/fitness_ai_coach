'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { User, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    lifestyle: '',
    experienceLevel: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age?.toString() || '',
        gender: user.gender || '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
        goal: user.goal || '',
        lifestyle: user.lifestyle || '',
        experienceLevel: user.experienceLevel || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.age || !formData.gender || !formData.height || !formData.weight || !formData.goal) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          gender: formData.gender,
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          goal: formData.goal,
          lifestyle: formData.lifestyle,
          experienceLevel: formData.experienceLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      await refreshUser();

      // Redirect to dashboard after successful update
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
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

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const goalOptions = [
    { value: '', label: 'Select Goal' },
    { value: 'weight_loss', label: 'Lose Weight' },
    { value: 'muscle_building', label: 'Build Muscle' },
    { value: 'maintenance', label: 'Maintain Weight' },
    { value: 'weight_gain', label: 'Gain Weight' },
  ];

  const lifestyleOptions = [
    { value: '', label: 'Select Lifestyle' },
    { value: 'sedentary', label: 'Sedentary (Little to no exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely Active (Athlete)' },
  ];

  const experienceLevelOptions = [
    { value: '', label: 'Select Experience Level' },
    { value: 'beginner', label: 'Beginner (0-1 year)' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)' },
    { value: 'advanced', label: 'Advanced (3+ years)' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground">Update your personal information</p>
            </div>
          </div>
        </div>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Provide accurate information to get personalized fitness recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  name="age"
                  label="Age *"
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
                  label="Gender *"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <Input
                  type="number"
                  name="height"
                  label="Height (cm) *"
                  placeholder="175"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min="100"
                  max="300"
                />

                <Input
                  type="number"
                  name="weight"
                  label="Weight (kg) *"
                  placeholder="70"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>

              <Select
                name="goal"
                label="Fitness Goal *"
                options={goalOptions}
                value={formData.goal}
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
                disabled={loading}
              />

              <Select
                name="experienceLevel"
                label="Experience Level"
                options={experienceLevelOptions}
                value={formData.experienceLevel}
                onChange={handleChange}
                disabled={loading}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
