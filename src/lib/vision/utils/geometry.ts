import type { PoseLandmark } from '../types';

/**
 * Calculate angle between three points using 3D coordinates (x, y, z).
 * Using world landmarks (metric space) gives accurate angles regardless
 * of camera orientation — critical for side-profile exercises like push-ups.
 * Falls back to 2D (x, y) when z is unavailable.
 */
export function calculateAngle(
  a: PoseLandmark,
  b: PoseLandmark,
  c: PoseLandmark
): number {
  // Vectors from vertex b
  const ba = { x: a.x - b.x, y: a.y - b.y, z: (a.z ?? 0) - (b.z ?? 0) };
  const bc = { x: c.x - b.x, y: c.y - b.y, z: (c.z ?? 0) - (b.z ?? 0) };

  const dot = ba.x * bc.x + ba.y * bc.y + ba.z * bc.z;
  const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2 + ba.z ** 2);
  const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2 + bc.z ** 2);

  if (magBA === 0 || magBC === 0) return 0;

  const cosAngle = Math.max(-1, Math.min(1, dot / (magBA * magBC)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

export function calculateDistance(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt(
    (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
  );
}

export function isLandmarkVisible(
  landmark: PoseLandmark,
  threshold = 0.5
): boolean {
  return (landmark.visibility ?? 0) >= threshold;
}

export function areLandmarksVisible(
  landmarks: PoseLandmark[],
  threshold = 0.5
): boolean {
  return landmarks.every((lm) => isLandmarkVisible(lm, threshold));
}

export function calculateVerticalAlignment(
  upper: PoseLandmark,
  lower: PoseLandmark
): number {
  const horizontalDeviation = Math.abs(upper.x - lower.x);
  return Math.round(Math.max(0, 100 - horizontalDeviation * 200));
}

/**
 * MediaPipe Pose Landmark Indices
 * Reference: https://google.github.io/mediapipe/solutions/pose.html
 */
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;
