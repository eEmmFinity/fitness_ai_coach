import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import WorkoutSession from '@/models/WorkoutSession';
import { withAuth } from '@/lib/withAuth';

const DAYS = 30;

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const GET = withAuth(async (_request, decoded) => {
  await connectDB();

  const now = new Date();
  const since = new Date(now);
  since.setUTCDate(since.getUTCDate() - (DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const userId = new mongoose.Types.ObjectId(decoded.userId);

  type DayBucket = {
    _id: string;
    sessions: number;
    reps: number;
    duration: number;
    avgForm: number;
    calories: number;
  };

  const daily = (await WorkoutSession.aggregate([
    { $match: { userId, createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        sessions: { $sum: 1 },
        reps: { $sum: '$repCount' },
        duration: { $sum: '$duration' },
        avgForm: { $avg: '$formScore' },
        calories: { $sum: '$caloriesBurned' },
      },
    },
  ])) as DayBucket[];

  const byKey = new Map(daily.map((d) => [d._id, d]));
  const series: {
    date: string;
    sessions: number;
    reps: number;
    duration: number;
    avgForm: number;
    calories: number;
  }[] = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    const key = ymd(d);
    const row = byKey.get(key);
    series.push({
      date: key,
      sessions: row?.sessions ?? 0,
      reps: row?.reps ?? 0,
      duration: row?.duration ?? 0,
      avgForm: row ? Math.round(row.avgForm) : 0,
      calories: Math.round(row?.calories ?? 0),
    });
  }

  // Streak: trailing consecutive days (counting today) with at least one session.
  let streak = 0;
  for (let i = series.length - 1; i >= 0; i--) {
    if (series[i].sessions > 0) streak++;
    else break;
  }

  type ExerciseAgg = { _id: string; sessions: number; reps: number };
  const byExercise = (await WorkoutSession.aggregate([
    { $match: { userId, createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$exerciseType',
        sessions: { $sum: 1 },
        reps: { $sum: '$repCount' },
      },
    },
  ])) as ExerciseAgg[];

  const totals = {
    sessions: series.reduce((a, d) => a + d.sessions, 0),
    reps: series.reduce((a, d) => a + d.reps, 0),
    duration: series.reduce((a, d) => a + d.duration, 0),
    calories: series.reduce((a, d) => a + d.calories, 0),
  };

  const formScores = series.filter((d) => d.sessions > 0).map((d) => d.avgForm);
  const avgForm =
    formScores.length === 0
      ? 0
      : Math.round(formScores.reduce((a, b) => a + b, 0) / formScores.length);

  return NextResponse.json({
    days: DAYS,
    series,
    totals,
    avgForm,
    streak,
    byExercise,
  });
});
