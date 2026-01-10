/**
 * MediaPipe Pose Types and Interfaces
 * Core type definitions for the CV-based exercise recognition system
 */

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseResults {
  poseLandmarks: PoseLandmark[];
  poseWorldLandmarks?: PoseLandmark[];
}

export interface ExerciseMetrics {
  repCount: number;
  formScore: number; // 0-100
  caloriesBurned: number;
  duration: number; // seconds
  tempo: number; // reps per minute
}

export interface FormFeedback {
  timestamp: number;
  severity: 'good' | 'warning' | 'error';
  message: string;
  affectedJoints: number[];
}

export interface WorkoutSession {
  sessionId: string;
  userId: string;
  exerciseType: 'squat' | 'pushup' | 'plank';
  startTime: Date;
  endTime?: Date;
  metrics: ExerciseMetrics;
  feedbackLog: FormFeedback[];
  videoRecorded: boolean;
}

export enum ExerciseState {
  IDLE = 'idle',
  READY = 'ready',
  DOWN = 'down',
  UP = 'up',
  HOLD = 'hold',
  REST = 'rest'
}

export interface ExerciseDetectorConfig {
  minDetectionConfidence: number;
  minTrackingConfidence: number;
  enableFeedback: boolean;
  targetReps?: number;
}
