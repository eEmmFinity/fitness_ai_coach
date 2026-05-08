import type { PoseResults, ExerciseMetrics, FormFeedback, ExerciseDetectorConfig, PoseLandmark } from '../types';
import { ExerciseState } from '../types';
import { calculateAngle, areLandmarksVisible, POSE_LANDMARKS } from '../utils/geometry';

export class SquatDetector {
  private state: ExerciseState = ExerciseState.IDLE;
  private repCount = 0;
  private formScore = 100;
  private feedbackLog: FormFeedback[] = [];
  // Fix #11: O(1) dedup lookup keyed by message string
  private feedbackTimestamps = new Map<string, number>();
  private startTime = Date.now();
  private config: ExerciseDetectorConfig;

  private lastRepTimestamp = Date.now();
  private repDurations: number[] = [];

  private readonly SQUAT_DOWN_THRESHOLD = 100;
  private readonly SQUAT_UP_THRESHOLD = 160;
  private readonly FORM_KNEE_ANGLE_MIN = 70;
  private readonly FORM_KNEE_ANGLE_MAX = 110;
  private readonly VISIBILITY_THRESHOLD = 0.6;
  private readonly TEMPO_MIN_SECONDS = 2;
  private readonly TEMPO_MAX_SECONDS = 4;

  constructor(config: Partial<ExerciseDetectorConfig> = {}) {
    this.config = {
      minDetectionConfidence: config.minDetectionConfidence ?? 0.7,
      minTrackingConfidence: config.minTrackingConfidence ?? 0.7,
      enableFeedback: config.enableFeedback ?? true,
      targetReps: config.targetReps,
    };
  }

  process(results: PoseResults): ExerciseMetrics {
    if (!results.poseLandmarks) return this.getMetrics();

    const lm = results.poseLandmarks;
    // Fix #9: prefer world landmarks (3D metric) for bilateral distance checks
    const wlm = results.poseWorldLandmarks ?? results.poseLandmarks;

    const leftHip    = lm[POSE_LANDMARKS.LEFT_HIP];
    const rightHip   = lm[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee   = lm[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee  = lm[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle  = lm[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle = lm[POSE_LANDMARKS.RIGHT_ANKLE];
    const leftShoulder  = lm[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = lm[POSE_LANDMARKS.RIGHT_SHOULDER];

    if (!areLandmarksVisible(
      [leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle],
      this.VISIBILITY_THRESHOLD
    )) {
      this.addFeedback('warning', 'Please ensure full body is visible in camera');
      return this.getMetrics();
    }

    const leftKneeAngle  = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle   = (leftKneeAngle + rightKneeAngle) / 2;

    const leftHipAngle  = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const avgHipAngle   = (leftHipAngle + rightHipAngle) / 2;

    this.updateState(avgKneeAngle);

    // Fix #7: pass world landmark coords for bilateral knee/ankle distance check
    this.analyzeForm(
      avgKneeAngle,
      avgHipAngle,
      wlm[POSE_LANDMARKS.LEFT_KNEE],
      wlm[POSE_LANDMARKS.RIGHT_KNEE],
      wlm[POSE_LANDMARKS.LEFT_ANKLE],
      wlm[POSE_LANDMARKS.RIGHT_ANKLE]
    );

    return this.getMetrics();
  }

  private updateState(kneeAngle: number): void {
    // Fix #1: removed dead prevState variable
    switch (this.state) {
      case ExerciseState.IDLE:
        if (kneeAngle > this.SQUAT_UP_THRESHOLD) this.state = ExerciseState.READY;
        break;

      case ExerciseState.READY:
        if (kneeAngle < this.SQUAT_DOWN_THRESHOLD) this.state = ExerciseState.DOWN;
        break;

      case ExerciseState.DOWN:
        if (kneeAngle > this.SQUAT_UP_THRESHOLD) {
          this.state = ExerciseState.UP;
          this.repCount++;
          this.trackRepTempo();
          this.addFeedback('good', `Rep ${this.repCount} completed!`);
        }
        break;

      case ExerciseState.UP:
        if (kneeAngle < this.SQUAT_DOWN_THRESHOLD) this.state = ExerciseState.DOWN;
        else if (kneeAngle > this.SQUAT_UP_THRESHOLD) this.state = ExerciseState.READY;
        break;
    }
  }

  private analyzeForm(
    kneeAngle: number,
    hipAngle: number,
    leftKnee: PoseLandmark,
    rightKnee: PoseLandmark,
    leftAnkle: PoseLandmark,
    rightAnkle: PoseLandmark
  ): void {
    // Fix #2: smoothed exponential decay instead of resetting from 100 each frame
    let framePenalty = 0;

    if (this.state === ExerciseState.DOWN) {
      if (kneeAngle > this.FORM_KNEE_ANGLE_MAX) {
        this.addFeedback('warning', 'Go deeper! Aim for 90° knee angle', [
          POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE,
        ]);
        framePenalty += 10;
      } else if (kneeAngle < this.FORM_KNEE_ANGLE_MIN) {
        this.addFeedback('warning', "Don't go too deep, risk of injury", [
          POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE,
        ]);
        framePenalty += 5;
      }

      if (hipAngle > 110) {
        this.addFeedback('warning', 'Bend at the hips more, push butt back', [
          POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP,
        ]);
        framePenalty += 10;
      }

      // Fix #7: use 3D world coords — reliable regardless of camera angle
      const kneeDistance  = Math.abs(leftKnee.x - rightKnee.x);
      const ankleDistance = Math.abs(leftAnkle.x - rightAnkle.x);
      if (ankleDistance > 0.01 && kneeDistance < ankleDistance * 0.8) {
        this.addFeedback('error', 'Knees caving in! Push knees outward', [
          POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE,
        ]);
        framePenalty += 15;
      }
    }

    // Fix #2: EMA decay — bad frames drag score down, good frames recover slowly
    const target = Math.max(0, 100 - framePenalty);
    this.formScore = this.formScore * 0.85 + target * 0.15;
  }

  private trackRepTempo(): void {
    const now = Date.now();
    const repDuration = (now - this.lastRepTimestamp) / 1000;

    if (this.repCount > 1) {
      this.repDurations.push(repDuration);
      if (this.repDurations.length > 5) this.repDurations.shift();

      if (repDuration < this.TEMPO_MIN_SECONDS) {
        this.addFeedback('warning', "Slow down! You're going too fast - control the movement");
      } else if (repDuration > this.TEMPO_MAX_SECONDS) {
        this.addFeedback('warning', 'Speed up a bit - maintain a steady tempo');
      }
    }

    this.lastRepTimestamp = now;
  }

  // Fix #4: removed dead getAverageTempo() — tempo display uses session reps/min

  private addFeedback(
    severity: 'good' | 'warning' | 'error',
    message: string,
    affectedJoints: number[] = []
  ): void {
    if (!this.config.enableFeedback) return;

    // Fix #11: O(1) Map lookup instead of O(n) find
    const now = Date.now();
    const last = this.feedbackTimestamps.get(message) ?? 0;
    if (now - last < 2000) return;

    this.feedbackTimestamps.set(message, now);
    this.feedbackLog.push({ timestamp: now, severity, message, affectedJoints });

    if (this.feedbackLog.length > 50) this.feedbackLog.shift();
  }

  getMetrics(): ExerciseMetrics {
    const duration = (Date.now() - this.startTime) / 1000;
    const tempo = duration > 0 ? (this.repCount / duration) * 60 : 0;
    const caloriesBurned = Math.round(this.repCount * 0.32 * 10) / 10;

    return {
      repCount: this.repCount,
      formScore: Math.round(this.formScore),
      caloriesBurned,
      duration: Math.round(duration),
      tempo: Math.round(tempo * 10) / 10,
    };
  }

  getRecentFeedback(): FormFeedback[] {
    return this.feedbackLog.slice(-5);
  }

  getState(): ExerciseState {
    return this.state;
  }

  reset(): void {
    this.state = ExerciseState.IDLE;
    this.repCount = 0;
    this.formScore = 100;
    this.feedbackLog = [];
    this.feedbackTimestamps.clear();
    this.startTime = Date.now();
    this.lastRepTimestamp = Date.now();
    this.repDurations = [];
  }
}
