import type { PoseResults, ExerciseMetrics, FormFeedback, ExerciseDetectorConfig, PoseLandmark } from '../types';
import { ExerciseState } from '../types';
import { calculateAngle, areLandmarksVisible, POSE_LANDMARKS } from '../utils/geometry';

export class PushupDetector {
  private state: ExerciseState = ExerciseState.IDLE;
  private repCount = 0;
  private formScore = 100;
  private feedbackLog: FormFeedback[] = [];
  // Fix #11: O(1) dedup lookup
  private feedbackTimestamps = new Map<string, number>();
  private startTime = Date.now();
  private config: ExerciseDetectorConfig;

  private lastRepTimestamp = Date.now();
  private repDurations: number[] = [];

  private readonly PUSHUP_DOWN_THRESHOLD = 90;
  private readonly PUSHUP_UP_THRESHOLD = 160;
  private readonly FORM_ELBOW_ANGLE_MIN = 70;
  private readonly FORM_ELBOW_ANGLE_MAX = 100;
  private readonly FORM_BODY_ALIGNMENT_MIN = 160;
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
    // Fix #9: use world landmarks for angle calculations — push-ups are side-profile
    const wlm = results.poseWorldLandmarks ?? results.poseLandmarks;

    const leftShoulder  = wlm[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = wlm[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftElbow     = wlm[POSE_LANDMARKS.LEFT_ELBOW];
    const rightElbow    = wlm[POSE_LANDMARKS.RIGHT_ELBOW];
    const leftWrist     = wlm[POSE_LANDMARKS.LEFT_WRIST];
    const rightWrist    = wlm[POSE_LANDMARKS.RIGHT_WRIST];
    const leftHip       = wlm[POSE_LANDMARKS.LEFT_HIP];
    const rightHip      = wlm[POSE_LANDMARKS.RIGHT_HIP];
    const leftAnkle     = wlm[POSE_LANDMARKS.LEFT_ANKLE];
    const rightAnkle    = wlm[POSE_LANDMARKS.RIGHT_ANKLE];

    // Visibility check uses screen landmarks (visibility scores live there)
    if (!areLandmarksVisible(
      [
        lm[POSE_LANDMARKS.LEFT_SHOULDER], lm[POSE_LANDMARKS.RIGHT_SHOULDER],
        lm[POSE_LANDMARKS.LEFT_ELBOW],    lm[POSE_LANDMARKS.RIGHT_ELBOW],
        lm[POSE_LANDMARKS.LEFT_WRIST],    lm[POSE_LANDMARKS.RIGHT_WRIST],
        lm[POSE_LANDMARKS.LEFT_HIP],      lm[POSE_LANDMARKS.RIGHT_HIP],
      ],
      this.VISIBILITY_THRESHOLD
    )) {
      this.addFeedback('warning', 'Please ensure upper body is visible in camera');
      return this.getMetrics();
    }

    const leftElbowAngle  = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle   = (leftElbowAngle + rightElbowAngle) / 2;

    const leftBodyAngle  = calculateAngle(leftShoulder, leftHip, leftAnkle);
    const rightBodyAngle = calculateAngle(rightShoulder, rightHip, rightAnkle);
    const avgBodyAngle   = (leftBodyAngle + rightBodyAngle) / 2;

    this.updateState(avgElbowAngle);
    this.analyzeForm(avgElbowAngle, avgBodyAngle, leftWrist, rightWrist, leftShoulder, rightShoulder);

    return this.getMetrics();
  }

  private updateState(elbowAngle: number): void {
    switch (this.state) {
      case ExerciseState.IDLE:
        if (elbowAngle > this.PUSHUP_UP_THRESHOLD) this.state = ExerciseState.READY;
        break;

      case ExerciseState.READY:
        if (elbowAngle < this.PUSHUP_DOWN_THRESHOLD) this.state = ExerciseState.DOWN;
        break;

      case ExerciseState.DOWN:
        if (elbowAngle > this.PUSHUP_UP_THRESHOLD) {
          this.state = ExerciseState.UP;
          this.repCount++;
          this.trackRepTempo();
          this.addFeedback('good', `Push-up ${this.repCount} completed!`);
        }
        break;

      case ExerciseState.UP:
        if (elbowAngle < this.PUSHUP_DOWN_THRESHOLD) this.state = ExerciseState.DOWN;
        else if (elbowAngle > this.PUSHUP_UP_THRESHOLD) this.state = ExerciseState.READY;
        break;
    }
  }

  private analyzeForm(
    elbowAngle: number,
    bodyAngle: number,
    leftWrist: PoseLandmark,
    rightWrist: PoseLandmark,
    leftShoulder: PoseLandmark,
    rightShoulder: PoseLandmark
  ): void {
    // Fix #2: EMA decay — persistent bad form persists in the score
    let framePenalty = 0;

    if (this.state === ExerciseState.DOWN) {
      if (elbowAngle > this.FORM_ELBOW_ANGLE_MAX) {
        this.addFeedback('warning', 'Go lower! Aim for 90° elbow bend', [
          POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.RIGHT_ELBOW,
        ]);
        framePenalty += 15;
      } else if (elbowAngle < this.FORM_ELBOW_ANGLE_MIN) {
        this.addFeedback('warning', "Don't go too deep, maintain control", [
          POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.RIGHT_ELBOW,
        ]);
        framePenalty += 5;
      }

      if (bodyAngle < this.FORM_BODY_ALIGNMENT_MIN) {
        this.addFeedback('error', 'Keep your body straight! No sagging hips', [
          POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP,
          POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER,
        ]);
        framePenalty += 20;
      }

      // Fix #9: world coords make this reliable for side-profile
      const handDistance     = Math.abs(leftWrist.x - rightWrist.x);
      const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x);
      if (shoulderDistance > 0.01) {
        if (handDistance < shoulderDistance * 0.8) {
          this.addFeedback('warning', 'Hands too narrow, widen your grip', [
            POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.RIGHT_WRIST,
          ]);
          framePenalty += 10;
        } else if (handDistance > shoulderDistance * 1.5) {
          this.addFeedback('warning', 'Hands too wide, narrow your grip', [
            POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.RIGHT_WRIST,
          ]);
          framePenalty += 10;
        }
      }
    }

    if (this.state === ExerciseState.UP || this.state === ExerciseState.READY) {
      if (bodyAngle < this.FORM_BODY_ALIGNMENT_MIN) {
        this.addFeedback('warning', 'Tighten your core, maintain plank position', [
          POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP,
        ]);
        framePenalty += 10;
      }
    }

    // Fix #2: EMA — smooth decay toward target, not a hard reset
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

  // Fix #4: removed dead getAverageTempo()

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
    const tempo = duration > 0 ? (this.repCount / duration) * 60 : 0;
    const caloriesBurned = Math.round(this.repCount * 0.29 * 10) / 10;

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
