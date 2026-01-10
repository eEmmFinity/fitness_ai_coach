/**
 * PlankDetector - Plank Exercise Recognition and Form Analysis
 * Hold-time tracking with biomechanical form scoring
 */

import type { PoseResults, ExerciseMetrics, FormFeedback, ExerciseDetectorConfig } from '../types';
import { ExerciseState } from '../types';
import { calculateAngle, areLandmarksVisible, POSE_LANDMARKS } from '../utils/geometry';

export class PlankDetector {
  private state: ExerciseState = ExerciseState.IDLE;
  private holdTime: number = 0; // Total hold time in seconds
  private currentHoldStart: number = 0; // Timestamp when current hold started
  private formScore: number = 100;
  private feedbackLog: FormFeedback[] = [];
  private startTime: number = Date.now();
  private config: ExerciseDetectorConfig;
  private lastUpdateTime: number = Date.now();

  // Biomechanical thresholds for plank
  private readonly PLANK_BODY_ALIGNMENT_MIN = 160; // Shoulder-hip-ankle angle
  private readonly PLANK_BODY_ALIGNMENT_MAX = 190; // Max angle (too arched)
  private readonly PLANK_ELBOW_ANGLE_MIN = 80; // Min elbow angle (forearm plank)
  private readonly PLANK_ELBOW_ANGLE_MAX = 100; // Max elbow angle
  private readonly VISIBILITY_THRESHOLD = 0.6;
  private readonly PLANK_STABILITY_FRAMES = 30; // Frames needed to confirm plank position

  private stableFrameCount: number = 0;

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

    const now = Date.now();
    const landmarks = results.poseLandmarks;

    // Get required landmarks for plank analysis
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
    const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    // Check visibility of critical landmarks
    if (
      !areLandmarksVisible(
        [leftShoulder, rightShoulder, leftElbow, rightElbow, leftHip, rightHip, leftKnee, rightKnee],
        this.VISIBILITY_THRESHOLD
      )
    ) {
      this.addFeedback('warning', 'Please ensure full body is visible in camera');
      this.exitPlank();
      return this.getMetrics();
    }

    // Calculate biomechanical angles
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    // Body alignment (shoulder-hip-ankle for plank position)
    const leftBodyAngle = calculateAngle(leftShoulder, leftHip, leftAnkle);
    const rightBodyAngle = calculateAngle(rightShoulder, rightHip, rightAnkle);
    const avgBodyAngle = (leftBodyAngle + rightBodyAngle) / 2;

    // Knee angle (should be straight ~180° for proper plank)
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    // Check if in plank position
    const isInPlank = this.checkPlankPosition(avgElbowAngle, avgBodyAngle, avgKneeAngle);

    // State machine logic
    this.updateState(isInPlank, now);

    // Form analysis
    this.analyzeForm(avgElbowAngle, avgBodyAngle, avgKneeAngle, leftHip, rightHip);

    // Update hold time if in hold state
    if (this.state === ExerciseState.HOLD && this.currentHoldStart > 0) {
      const deltaTime = (now - this.lastUpdateTime) / 1000;
      this.holdTime += deltaTime;
    }

    this.lastUpdateTime = now;
    return this.getMetrics();
  }

  /**
   * Check if user is in proper plank position
   */
  private checkPlankPosition(elbowAngle: number, bodyAngle: number, kneeAngle: number): boolean {
    // Forearm plank: elbows bent 80-100°
    const elbowsCorrect = elbowAngle >= this.PLANK_ELBOW_ANGLE_MIN && elbowAngle <= this.PLANK_ELBOW_ANGLE_MAX;

    // Body alignment: shoulder-hip-ankle ~160-190°
    const bodyAligned = bodyAngle >= this.PLANK_BODY_ALIGNMENT_MIN && bodyAngle <= this.PLANK_BODY_ALIGNMENT_MAX;

    // Knees straight: >160°
    const kneesExtended = kneeAngle > 160;

    return elbowsCorrect && bodyAligned && kneesExtended;
  }

  /**
   * Update exercise state based on plank position
   */
  private updateState(isInPlank: boolean, now: number): void {
    if (isInPlank) {
      this.stableFrameCount++;

      // Require stability for a few frames before confirming plank
      if (this.stableFrameCount >= this.PLANK_STABILITY_FRAMES) {
        if (this.state !== ExerciseState.HOLD) {
          this.state = ExerciseState.HOLD;
          this.currentHoldStart = now;
          this.addFeedback('good', 'Plank position locked! Hold steady');
        }
      } else if (this.state === ExerciseState.IDLE) {
        this.state = ExerciseState.READY;
      }
    } else {
      // Lost plank position
      if (this.state === ExerciseState.HOLD) {
        this.addFeedback('warning', 'Plank position lost');
        this.exitPlank();
      }
      this.stableFrameCount = 0;
      this.state = ExerciseState.IDLE;
    }
  }

  /**
   * Exit plank position (user broke form)
   */
  private exitPlank(): void {
    this.currentHoldStart = 0;
    this.stableFrameCount = 0;
  }

  /**
   * Analyze plank form and provide feedback
   */
  private analyzeForm(
    elbowAngle: number,
    bodyAngle: number,
    kneeAngle: number,
    leftHip: any,
    rightHip: any
  ): void {
    let formPenalty = 0;

    if (this.state === ExerciseState.HOLD || this.state === ExerciseState.READY) {
      // Check body alignment
      if (bodyAngle < this.PLANK_BODY_ALIGNMENT_MIN) {
        this.addFeedback('error', 'Hips sagging! Engage your core', [
          POSE_LANDMARKS.LEFT_HIP,
          POSE_LANDMARKS.RIGHT_HIP,
        ]);
        formPenalty += 25;
      } else if (bodyAngle > this.PLANK_BODY_ALIGNMENT_MAX) {
        this.addFeedback('warning', 'Hips too high! Lower slightly', [
          POSE_LANDMARKS.LEFT_HIP,
          POSE_LANDMARKS.RIGHT_HIP,
        ]);
        formPenalty += 15;
      }

      // Check elbow position
      if (elbowAngle < this.PLANK_ELBOW_ANGLE_MIN) {
        this.addFeedback('warning', 'Elbows too bent, extend forearms', [
          POSE_LANDMARKS.LEFT_ELBOW,
          POSE_LANDMARKS.RIGHT_ELBOW,
        ]);
        formPenalty += 10;
      } else if (elbowAngle > this.PLANK_ELBOW_ANGLE_MAX) {
        this.addFeedback('warning', 'Elbows too straight, bend slightly', [
          POSE_LANDMARKS.LEFT_ELBOW,
          POSE_LANDMARKS.RIGHT_ELBOW,
        ]);
        formPenalty += 10;
      }

      // Check knee extension
      if (kneeAngle < 160) {
        this.addFeedback('error', 'Knees bent! Extend your legs fully', [
          POSE_LANDMARKS.LEFT_KNEE,
          POSE_LANDMARKS.RIGHT_KNEE,
        ]);
        formPenalty += 20;
      }

      // Check hip alignment (shouldn't twist)
      const hipYDiff = Math.abs(leftHip.y - rightHip.y);
      if (hipYDiff > 0.05) {
        this.addFeedback('warning', 'Hips twisting! Keep them level', [
          POSE_LANDMARKS.LEFT_HIP,
          POSE_LANDMARKS.RIGHT_HIP,
        ]);
        formPenalty += 10;
      }
    }

    // Update form score
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

    // For plank, "repCount" represents hold time in seconds
    const repCount = Math.floor(this.holdTime);

    // Calorie estimation: ~2-5 calories per minute of plank (varies by body weight)
    // Using 3.5 cal/min average = 0.058 cal/sec
    const caloriesBurned = Math.round(this.holdTime * 0.058 * 10) / 10;

    // Tempo not applicable for plank (static hold)
    const tempo = 0;

    return {
      repCount,
      formScore: Math.round(this.formScore),
      caloriesBurned,
      duration: Math.round(duration),
      tempo,
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
    this.holdTime = 0;
    this.currentHoldStart = 0;
    this.formScore = 100;
    this.feedbackLog = [];
    this.startTime = Date.now();
    this.lastUpdateTime = Date.now();
    this.stableFrameCount = 0;
  }
}
