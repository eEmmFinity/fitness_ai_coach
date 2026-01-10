/**
 * Geometry Utilities for Biomechanical Calculations
 * Handles angle calculations and landmark-based measurements
 */

import type { PoseLandmark } from '../types';

/**
 * Calculate angle between three points (in degrees)
 * @param a - First point (e.g., shoulder)
 * @param b - Middle point (e.g., elbow) - vertex of angle
 * @param c - Third point (e.g., wrist)
 * @returns Angle in degrees (0-180)
 */
export function calculateAngle(
  a: PoseLandmark,
  b: PoseLandmark,
  c: PoseLandmark
): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

/**
 * Calculate Euclidean distance between two landmarks
 * @param a - First landmark
 * @param b - Second landmark
 * @returns Distance (normalized 0-1 coordinate space)
 */
export function calculateDistance(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
  );
}

/**
 * Check if landmark is visible (confidence threshold)
 * @param landmark - Pose landmark to check
 * @param threshold - Minimum visibility score (default 0.5)
 * @returns True if landmark is sufficiently visible
 */
export function isLandmarkVisible(
  landmark: PoseLandmark,
  threshold: number = 0.5
): boolean {
  return (landmark.visibility ?? 0) >= threshold;
}

/**
 * Check if all required landmarks are visible
 * @param landmarks - Array of landmarks to check
 * @param threshold - Minimum visibility score
 * @returns True if all landmarks meet threshold
 */
export function areLandmarksVisible(
  landmarks: PoseLandmark[],
  threshold: number = 0.5
): boolean {
  return landmarks.every((lm) => isLandmarkVisible(lm, threshold));
}

/**
 * Calculate vertical alignment score (0-100)
 * Used for checking posture alignment (e.g., knee over ankle)
 * @param upper - Upper landmark
 * @param lower - Lower landmark
 * @returns Alignment score (100 = perfectly aligned, 0 = max deviation)
 */
export function calculateVerticalAlignment(
  upper: PoseLandmark,
  lower: PoseLandmark
): number {
  const horizontalDeviation = Math.abs(upper.x - lower.x);
  const score = Math.max(0, 100 - horizontalDeviation * 200); // Scale deviation
  return Math.round(score);
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
