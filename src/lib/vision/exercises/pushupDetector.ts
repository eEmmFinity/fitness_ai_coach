/**
 * PushupDetector - Push-up Exercise Recognition and Form Analysis
 * State machine-based rep counting with biomechanical form scoring
 */

import type { PoseResults, ExerciseMetrics, FormFeedback, ExerciseDetectorConfig } from '../types';
import { ExerciseState } from '../types';
import { calculateAngle, areLandmarksVisible, POSE_LANDMARKS } from '../utils/geometry';

export class PushupDetector {
  private state: ExerciseState = ExerciseState.IDLE;
  private repCount: number = 0;
  private formScore: number = 100;
  private feedbackLog: FormFeedback[] = [];
  private startTime: number = Date.now();
  private config: ExerciseDetectorConfig;

  // Tempo tracking (Week 3 enhancement)
  private lastRepTimestamp: number = Date.now();
  private repDurations: number[] = []; // Track last 5 rep durations

  // Biomechanical thresholds for push-ups
  private readonly PUSHUP_DOWN_THRESHOLD = 90; // Elbow angle for bottom position
  private readonly PUSHUP_UP_THRESHOLD = 160; // Elbow angle for top position
  private readonly FORM_ELBOW_ANGLE_MIN = 70; // Min elbow angle for good depth
  private readonly FORM_ELBOW_ANGLE_MAX = 100; // Max elbow angle at bottom
  private readonly FORM_BODY_ALIGNMENT_MIN = 160; // Shoulder-hip-ankle alignment
  private readonly VISIBILITY_THRESHOLD = 0.6;

  // Tempo thresholds (Week 3)
  private readonly TEMPO_MIN_SECONDS = 2; // Minimum 2 seconds per rep
  private readonly TEMPO_MAX_SECONDS = 4; // Maximum 4 seconds per rep

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

    // Get required landmarks for push-up analysis
    const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
    const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    // Check visibility of critical landmarks
    if (
      !areLandmarksVisible(
        [leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist, leftHip, rightHip],
        this.VISIBILITY_THRESHOLD
      )
    ) {
      this.addFeedback('warning', 'Please ensure upper body is visible in camera');
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

    // State machine logic
    this.updateState(avgElbowAngle);

    // Form analysis
    this.analyzeForm(avgElbowAngle, avgBodyAngle, leftWrist, rightWrist, leftShoulder, rightShoulder);

    return this.getMetrics();
  }

  /**
   * Update exercise state based on elbow angle
   */
  private updateState(elbowAngle: number): void {
    switch (this.state) {
      case ExerciseState.IDLE:
        if (elbowAngle > this.PUSHUP_UP_THRESHOLD) {
          this.state = ExerciseState.READY;
        }
        break;

      case ExerciseState.READY:
        if (elbowAngle < this.PUSHUP_DOWN_THRESHOLD) {
          this.state = ExerciseState.DOWN;
        }
        break;

      case ExerciseState.DOWN:
        if (elbowAngle > this.PUSHUP_UP_THRESHOLD) {
          this.state = ExerciseState.UP;
          this.repCount++; // Rep completed!

          // Track tempo (Week 3)
          this.trackRepTempo();

          this.addFeedback('good', `Push-up ${this.repCount} completed!`);
        }
        break;

      case ExerciseState.UP:
        if (elbowAngle < this.PUSHUP_DOWN_THRESHOLD) {
          this.state = ExerciseState.DOWN;
        } else if (elbowAngle > this.PUSHUP_UP_THRESHOLD) {
          this.state = ExerciseState.READY;
        }
        break;
    }
  }

  /**
   * Analyze push-up form and provide feedback
   */
  private analyzeForm(
    elbowAngle: number,
    bodyAngle: number,
    leftWrist: any,
    rightWrist: any,
    leftShoulder: any,
    rightShoulder: any
  ): void {
    let formPenalty = 0;

    // Check push-up depth
    if (this.state === ExerciseState.DOWN) {
      if (elbowAngle > this.FORM_ELBOW_ANGLE_MAX) {
        this.addFeedback('warning', 'Go lower! Aim for 90° elbow bend', [
          POSE_LANDMARKS.LEFT_ELBOW,
          POSE_LANDMARKS.RIGHT_ELBOW,
        ]);
        formPenalty += 15;
      } else if (elbowAngle < this.FORM_ELBOW_ANGLE_MIN) {
        this.addFeedback('warning', 'Don\'t go too deep, maintain control', [
          POSE_LANDMARKS.LEFT_ELBOW,
          POSE_LANDMARKS.RIGHT_ELBOW,
        ]);
        formPenalty += 5;
      }

      // Check body alignment (plank position)
      if (bodyAngle < this.FORM_BODY_ALIGNMENT_MIN) {
        this.addFeedback('error', 'Keep your body straight! No sagging hips', [
          POSE_LANDMARKS.LEFT_HIP,
          POSE_LANDMARKS.RIGHT_HIP,
          POSE_LANDMARKS.LEFT_SHOULDER,
          POSE_LANDMARKS.RIGHT_SHOULDER,
        ]);
        formPenalty += 20;
      }

      // Check hand position (should be shoulder-width or slightly wider)
      const handDistance = Math.abs(leftWrist.x - rightWrist.x);
      const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
      if (handDistance < shoulderDistance * 0.8) {
        this.addFeedback('warning', 'Hands too narrow, widen your grip', [
          POSE_LANDMARKS.LEFT_WRIST,
          POSE_LANDMARKS.RIGHT_WRIST,
        ]);
        formPenalty += 10;
      } else if (handDistance > shoulderDistance * 1.5) {
        this.addFeedback('warning', 'Hands too wide, narrow your grip', [
          POSE_LANDMARKS.LEFT_WRIST,
          POSE_LANDMARKS.RIGHT_WRIST,
        ]);
        formPenalty += 10;
      }
    }

    // Check body alignment during up phase too
    if (this.state === ExerciseState.UP || this.state === ExerciseState.READY) {
      if (bodyAngle < this.FORM_BODY_ALIGNMENT_MIN) {
        this.addFeedback('warning', 'Tighten your core, maintain plank position', [
          POSE_LANDMARKS.LEFT_HIP,
          POSE_LANDMARKS.RIGHT_HIP,
        ]);
        formPenalty += 10;
      }
    }

    // Update form score (exponential decay to recent performance)
    this.formScore = Math.max(0, Math.min(100, 100 - formPenalty));
  }

  /**
   * Track rep tempo and provide feedback (Week 3)
   */
  private trackRepTempo(): void {
    const now = Date.now();
    const repDuration = (now - this.lastRepTimestamp) / 1000; // seconds

    // Skip first rep (no baseline)
    if (this.repCount > 1) {
      this.repDurations.push(repDuration);

      // Keep only last 5 durations
      if (this.repDurations.length > 5) {
        this.repDurations.shift();
      }

      // Provide tempo feedback
      if (repDuration < this.TEMPO_MIN_SECONDS) {
        this.addFeedback('warning', 'Slow down! You\'re going too fast - control the movement');
      } else if (repDuration > this.TEMPO_MAX_SECONDS) {
        this.addFeedback('warning', 'Speed up a bit - maintain a steady tempo');
      }
    }

    this.lastRepTimestamp = now;
  }

  /**
   * Get average tempo over recent reps
   */
  private getAverageTempo(): number {
    if (this.repDurations.length === 0) return 0;

    const sum = this.repDurations.reduce((a, b) => a + b, 0);
    return sum / this.repDurations.length;
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

    // Calorie estimation: ~0.29 calories per push-up (varies by body weight)
    const caloriesBurned = Math.round(this.repCount * 0.29 * 10) / 10;

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
    this.lastRepTimestamp = Date.now();
    this.repDurations = [];
  }
}
