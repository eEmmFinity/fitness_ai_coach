import type { PoseResults, ExerciseMetrics, FormFeedback, ExerciseDetectorConfig, PoseLandmark } from '../types';
import { ExerciseState } from '../types';
import { calculateAngle, areLandmarksVisible, POSE_LANDMARKS } from '../utils/geometry';

type PlankVariant = 'forearm' | 'high' | 'unknown';

export class PlankDetector {
  private state: ExerciseState = ExerciseState.IDLE;
  private holdTime = 0;
  private currentHoldStart = 0;
  private formScore = 100;
  private feedbackLog: FormFeedback[] = [];
  // Fix #11: O(1) dedup lookup
  private feedbackTimestamps = new Map<string, number>();
  private startTime = Date.now();
  private config: ExerciseDetectorConfig;
  private lastUpdateTime = Date.now();
  private stableFrameCount = 0;
  private detectedVariant: PlankVariant = 'unknown';

  // Fix #8: calculateAngle() returns 0-180°, so MAX must be ≤180
  // Body alignment for plank: roughly straight line shoulder→hip→ankle
  private readonly PLANK_BODY_ALIGNMENT_MIN = 160;
  private readonly PLANK_BODY_ALIGNMENT_MAX = 180; // was 190 — geometrically impossible
  // Fix #10: support both forearm (80-100°) and high plank (150-175°)
  private readonly FOREARM_ELBOW_MIN = 80;
  private readonly FOREARM_ELBOW_MAX = 100;
  private readonly HIGH_ELBOW_MIN = 150;
  private readonly VISIBILITY_THRESHOLD = 0.6;
  private readonly PLANK_STABILITY_FRAMES = 30;

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

    const now = Date.now();
    const lm  = results.poseLandmarks;
    // Fix #9: use world landmarks for angle math
    const wlm = results.poseWorldLandmarks ?? results.poseLandmarks;

    const leftShoulder  = wlm[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = wlm[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftElbow     = wlm[POSE_LANDMARKS.LEFT_ELBOW];
    const rightElbow    = wlm[POSE_LANDMARKS.RIGHT_ELBOW];
    const leftWrist     = wlm[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist    = wlm[POSE_LANDMARKS.RIGHT_WRIST];
    const leftHip       = wlm[POSE_LANDMARKS.LEFT_HIP];
    const rightHip      = wlm[POSE_LANDMARKS.RIGHT_HIP];
    const leftKnee      = wlm[POSE_LANDMARKS.LEFT_KNEE];
    const rightKnee     = wlm[POSE_LANDMARKS.RIGHT_KNEE];
    const leftAnkle     = wlm[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle    = wlm[POSE_LANDMARKS.RIGHT_ANKLE];

    // Visibility check uses screen landmarks (visibility scores live there)
    if (!areLandmarksVisible(
      [
        lm[POSE_LANDMARKS.LEFT_SHOULDER],  lm[POSE_LANDMARKS.RIGHT_SHOULDER],
        lm[POSE_LANDMARKS.LEFT_ELBOW],     lm[POSE_LANDMARKS.RIGHT_ELBOW],
        lm[POSE_LANDMARKS.LEFT_HIP],       lm[POSE_LANDMARKS.RIGHT_HIP],
        lm[POSE_LANDMARKS.LEFT_KNEE],      lm[POSE_LANDMARKS.RIGHT_KNEE],
      ],
      this.VISIBILITY_THRESHOLD
    )) {
      this.addFeedback('warning', 'Please ensure full body is visible in camera');
      // Fix #3: only call exitPlank logic via updateState, not separately here
      this.handleVisibilityLoss(now);
      return this.getMetrics();
    }

    const leftElbowAngle  = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle   = (leftElbowAngle + rightElbowAngle) / 2;

    const leftBodyAngle  = calculateAngle(leftShoulder, leftHip, leftAnkle);
    const rightBodyAngle = calculateAngle(rightShoulder, rightHip, rightAnkle);
    const avgBodyAngle   = (leftBodyAngle + rightBodyAngle) / 2;

    const leftKneeAngle  = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const avgKneeAngle   = (leftKneeAngle + rightKneeAngle) / 2;

    // Fix #10: detect which variant before checking position
    this.detectedVariant = this.detectVariant(avgElbowAngle);
    const isInPlank = this.checkPlankPosition(avgElbowAngle, avgBodyAngle, avgKneeAngle);

    this.updateState(isInPlank, now);
    this.analyzeForm(avgElbowAngle, avgBodyAngle, avgKneeAngle, leftHip, rightHip);

    if (this.state === ExerciseState.HOLD && this.currentHoldStart > 0) {
      const deltaTime = (now - this.lastUpdateTime) / 1000;
      this.holdTime += deltaTime;
    }

    this.lastUpdateTime = now;
    return this.getMetrics();
  }

  // Fix #10: identify forearm vs high plank
  private detectVariant(elbowAngle: number): PlankVariant {
    if (elbowAngle >= this.FOREARM_ELBOW_MIN && elbowAngle <= this.FOREARM_ELBOW_MAX) {
      return 'forearm';
    }
    if (elbowAngle >= this.HIGH_ELBOW_MIN) {
      return 'high';
    }
    return 'unknown';
  }

  private checkPlankPosition(elbowAngle: number, bodyAngle: number, kneeAngle: number): boolean {
    // Fix #10: accept both forearm and high plank elbow positions
    const elbowsCorrect =
      (elbowAngle >= this.FOREARM_ELBOW_MIN && elbowAngle <= this.FOREARM_ELBOW_MAX) ||
      (elbowAngle >= this.HIGH_ELBOW_MIN);

    // Fix #8: MAX is now 180° (was 190° — unreachable with atan2-based angle math)
    const bodyAligned =
      bodyAngle >= this.PLANK_BODY_ALIGNMENT_MIN &&
      bodyAngle <= this.PLANK_BODY_ALIGNMENT_MAX;

    const kneesExtended = kneeAngle > 160;

    return elbowsCorrect && bodyAligned && kneesExtended;
  }

  private updateState(isInPlank: boolean, now: number): void {
    if (isInPlank) {
      this.stableFrameCount++;

      if (this.stableFrameCount >= this.PLANK_STABILITY_FRAMES) {
        if (this.state !== ExerciseState.HOLD) {
          this.state = ExerciseState.HOLD;
          this.currentHoldStart = now;
          const variantLabel = this.detectedVariant === 'forearm' ? 'Forearm plank' : 'Plank';
          this.addFeedback('good', `${variantLabel} position locked! Hold steady`);
        }
      } else if (this.state === ExerciseState.IDLE) {
        this.state = ExerciseState.READY;
      }
    } else {
      // Fix #3: single consolidated exit — no separate exitPlank() call from process()
      if (this.state === ExerciseState.HOLD) {
        this.addFeedback('warning', 'Plank position lost');
      }
      this.currentHoldStart = 0;
      this.stableFrameCount = 0;
      this.state = ExerciseState.IDLE;
    }
  }

  // Fix #3: eliminated the separate exitPlank() method — logic merged into updateState
  // handleVisibilityLoss replaces the old process()-level exitPlank() call
  private handleVisibilityLoss(now: number): void {
    if (this.state === ExerciseState.HOLD) {
      // Don't accumulate hold time when invisible
      this.lastUpdateTime = now;
    }
    this.currentHoldStart = 0;
    this.stableFrameCount = 0;
    this.state = ExerciseState.IDLE;
  }

  private analyzeForm(
    elbowAngle: number,
    bodyAngle: number,
    kneeAngle: number,
    leftHip: PoseLandmark,
    rightHip: PoseLandmark
  ): void {
    // Fix #2: EMA decay
    let framePenalty = 0;

    if (this.state === ExerciseState.HOLD || this.state === ExerciseState.READY) {
      if (bodyAngle < this.PLANK_BODY_ALIGNMENT_MIN) {
        this.addFeedback('error', 'Hips sagging! Engage your core', [
          POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP,
        ]);
        framePenalty += 25;
      } else if (bodyAngle >= this.PLANK_BODY_ALIGNMENT_MAX) {
        // Fix #8: this branch now fires correctly when bodyAngle is at/near 180°
        // (pike position — hips too high relative to body line)
        this.addFeedback('warning', 'Hips too high! Lower slightly', [
          POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP,
        ]);
        framePenalty += 15;
      }

      // Fix #10: elbow feedback is variant-aware
      if (this.detectedVariant === 'forearm') {
        if (elbowAngle < this.FOREARM_ELBOW_MIN) {
          this.addFeedback('warning', 'Elbows too bent, extend forearms', [
            POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.RIGHT_ELBOW,
          ]);
          framePenalty += 10;
        } else if (elbowAngle > this.FOREARM_ELBOW_MAX) {
          this.addFeedback('warning', 'Elbows too straight for forearm plank', [
            POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.RIGHT_ELBOW,
          ]);
          framePenalty += 10;
        }
      }

      if (kneeAngle < 160) {
        this.addFeedback('error', 'Knees bent! Extend your legs fully', [
          POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE,
        ]);
        framePenalty += 20;
      }

      const hipYDiff = Math.abs(leftHip.y - rightHip.y);
      if (hipYDiff > 0.05) {
        this.addFeedback('warning', 'Hips twisting! Keep them level', [
          POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP,
        ]);
        framePenalty += 10;
      }
    }

    // Fix #2: EMA form score
    const target = Math.max(0, 100 - framePenalty);
    this.formScore = this.formScore * 0.85 + target * 0.15;
  }

  private addFeedback(
    severity: 'good' | 'warning' | 'error',
    message: string,
    affectedJoints: number[] = []
  ): void {
    if (!this.config.enableFeedback) return;

    // Fix #11: O(1) Map lookup
    const now = Date.now();
    const last = this.feedbackTimestamps.get(message) ?? 0;
    if (now - last < 2000) return;

    this.feedbackTimestamps.set(message, now);
    this.feedbackLog.push({ timestamp: now, severity, message, affectedJoints });

    if (this.feedbackLog.length > 50) this.feedbackLog.shift();
  }

  getMetrics(): ExerciseMetrics {
    const duration = (Date.now() - this.startTime) / 1000;
    const repCount = Math.floor(this.holdTime);
    const caloriesBurned = Math.round(this.holdTime * 0.058 * 10) / 10;

    return {
      repCount,
      formScore: Math.round(this.formScore),
      caloriesBurned,
      duration: Math.round(duration),
      tempo: 0,
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
    this.holdTime = 0;
    this.currentHoldStart = 0;
    this.formScore = 100;
    this.feedbackLog = [];
    this.feedbackTimestamps.clear();
    this.startTime = Date.now();
    this.lastUpdateTime = Date.now();
    this.stableFrameCount = 0;
    this.detectedVariant = 'unknown';
  }
}
