/**
 * SquatDetector - Squat Exercise Recognition and Form Analysis
 * State machine-based rep counting with biomechanical form scoring
 */

import type { PoseResults, ExerciseMetrics, FormFeedback, ExerciseDetectorConfig } from '../types';
import { ExerciseState } from '../types';
import { calculateAngle, areLandmarksVisible, POSE_LANDMARKS } from '../utils/geometry';

export class SquatDetector {
  private state: ExerciseState = ExerciseState.IDLE;
  private repCount: number = 0;
  private formScore: number = 100;
  private feedbackLog: FormFeedback[] = [];
  private startTime: number = Date.now();
  private config: ExerciseDetectorConfig;

  // Biomechanical thresholds
  private readonly SQUAT_DOWN_THRESHOLD = 100; // Knee angle for squat depth
  private readonly SQUAT_UP_THRESHOLD = 160; // Knee angle for standing
  private readonly FORM_KNEE_ANGLE_MIN = 70; // Min knee angle for good form
  private readonly FORM_KNEE_ANGLE_MAX = 110; // Max knee angle at bottom
  private readonly FORM_HIP_ANGLE_MIN = 60; // Min hip angle
  private readonly VISIBILITY_THRESHOLD = 0.6;

  constructor(config: Partial<ExerciseDetectorConfig> = {}) {
    this.config = {
      minDetectionConfidence: config.minDetectionConfidence ?? 0.7,
      minTrackingConfidence: config.minTrackingConfidence ?? 0.7,
      enableFeedback: config.enableFeedback ?? true,
      targetReps: config.targetReps,
    };
  }

  /**
   * Process pose landmarks and update exercise state
   * @param results - MediaPipe pose detection results
   * @returns Current exercise metrics
   */
  process(results: PoseResults): ExerciseMetrics {
    if (!results.poseLandmarks) {
      return this.getMetrics();
    }

    const landmarks = results.poseLandmarks;

    // Get required landmarks for squat analysis
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];

    // Check visibility of critical landmarks
    if (
      !areLandmarksVisible(
        [leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle],
        this.VISIBILITY_THRESHOLD
      )
    ) {
      this.addFeedback('warning', 'Please ensure full body is visible in camera');
      return this.getMetrics();
    }

    // Calculate biomechanical angles
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const avgHipAngle = (leftHipAngle + rightHipAngle) / 2;

    // State machine logic
    this.updateState(avgKneeAngle);

    // Form analysis
    this.analyzeForm(avgKneeAngle, avgHipAngle, leftKnee, rightKnee, leftAnkle, rightAnkle);

    return this.getMetrics();
  }

  /**
   * Update exercise state based on knee angle
   */
  private updateState(kneeAngle: number): void {
    const prevState = this.state;

    switch (this.state) {
      case ExerciseState.IDLE:
        if (kneeAngle > this.SQUAT_UP_THRESHOLD) {
          this.state = ExerciseState.READY;
        }
        break;

      case ExerciseState.READY:
        if (kneeAngle < this.SQUAT_DOWN_THRESHOLD) {
          this.state = ExerciseState.DOWN;
        }
        break;

      case ExerciseState.DOWN:
        if (kneeAngle > this.SQUAT_UP_THRESHOLD) {
          this.state = ExerciseState.UP;
          this.repCount++; // Rep completed!
          this.addFeedback('good', `Rep ${this.repCount} completed!`);
        }
        break;

      case ExerciseState.UP:
        if (kneeAngle < this.SQUAT_DOWN_THRESHOLD) {
          this.state = ExerciseState.DOWN;
        } else if (kneeAngle > this.SQUAT_UP_THRESHOLD) {
          this.state = ExerciseState.READY;
        }
        break;
    }
  }

  /**
   * Analyze squat form and provide feedback
   */
  private analyzeForm(
    kneeAngle: number,
    hipAngle: number,
    leftKnee: any,
    rightKnee: any,
    leftAnkle: any,
    rightAnkle: any
  ): void {
    let formPenalty = 0;

    // Check squat depth
    if (this.state === ExerciseState.DOWN) {
      if (kneeAngle > this.FORM_KNEE_ANGLE_MAX) {
        this.addFeedback('warning', 'Go deeper! Aim for 90° knee angle');
        formPenalty += 10;
      } else if (kneeAngle < this.FORM_KNEE_ANGLE_MIN) {
        this.addFeedback('warning', 'Don\'t go too deep, risk of injury');
        formPenalty += 5;
      }

      // Check hip hinge
      if (hipAngle > 110) {
        this.addFeedback('warning', 'Bend at the hips more, push butt back');
        formPenalty += 10;
      }

      // Check knee alignment (shouldn't cave inward)
      const kneeDistance = Math.abs(leftKnee.x - rightKnee.x);
      const ankleDistance = Math.abs(leftAnkle.x - rightAnkle.x);
      if (kneeDistance < ankleDistance * 0.8) {
        this.addFeedback('error', 'Knees caving in! Push knees outward');
        formPenalty += 15;
      }
    }

    // Update form score (exponential decay to recent performance)
    this.formScore = Math.max(0, Math.min(100, 100 - formPenalty));
  }

  /**
   * Add feedback to log
   */
  private addFeedback(
    severity: 'good' | 'warning' | 'error',
    message: string,
    affectedJoints: number[] = []
  ): void {
    if (!this.config.enableFeedback) return;

    // Prevent duplicate feedback spam (within 2 seconds)
    const now = Date.now();
    const recentSimilar = this.feedbackLog.find(
      (f) => f.message === message && now - f.timestamp < 2000
    );
    if (recentSimilar) return;

    this.feedbackLog.push({
      timestamp: now,
      severity,
      message,
      affectedJoints,
    });

    // Keep only last 50 feedback items
    if (this.feedbackLog.length > 50) {
      this.feedbackLog.shift();
    }
  }

  /**
   * Get current exercise metrics
   */
  getMetrics(): ExerciseMetrics {
    const duration = (Date.now() - this.startTime) / 1000; // seconds
    const tempo = duration > 0 ? (this.repCount / duration) * 60 : 0; // reps per minute

    // Calorie estimation: ~0.32 calories per squat (varies by body weight)
    const caloriesBurned = Math.round(this.repCount * 0.32 * 10) / 10;

    return {
      repCount: this.repCount,
      formScore: Math.round(this.formScore),
      caloriesBurned,
      duration: Math.round(duration),
      tempo: Math.round(tempo * 10) / 10,
    };
  }

  /**
   * Get recent feedback (last 5 items)
   */
  getRecentFeedback(): FormFeedback[] {
    return this.feedbackLog.slice(-5);
  }

  /**
   * Get current exercise state
   */
  getState(): ExerciseState {
    return this.state;
  }

  /**
   * Reset detector for new session
   */
  reset(): void {
    this.state = ExerciseState.IDLE;
    this.repCount = 0;
    this.formScore = 100;
    this.feedbackLog = [];
    this.startTime = Date.now();
  }
}
