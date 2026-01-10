/**
 * PoseDetector - Core MediaPipe Pose Detection Wrapper
 * Handles real-time pose landmark detection from webcam feed
 */

import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import type { PoseResults } from '../types';

export class PoseDetector {
  private pose: Pose | null = null;
  private camera: Camera | null = null;
  private onResultsCallback: ((results: PoseResults) => void) | null = null;

  /**
   * Initialize MediaPipe Pose with optimized settings
   * @param videoElement - HTML video element for camera feed
   */
  async initialize(videoElement: HTMLVideoElement): Promise<void> {
    try {
      // Initialize MediaPipe Pose
      this.pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      this.pose.setOptions({
        modelComplexity: 1, // 0=Lite, 1=Full, 2=Heavy (balance speed/accuracy)
        smoothLandmarks: true,
        enableSegmentation: false, // Disable background segmentation for performance
        smoothSegmentation: false,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      // Set up results callback
      this.pose.onResults((results: Results) => {
        if (this.onResultsCallback && results.poseLandmarks) {
          this.onResultsCallback({
            poseLandmarks: results.poseLandmarks,
            poseWorldLandmarks: results.poseWorldLandmarks,
          });
        }
      });

      // Initialize camera
      this.camera = new Camera(videoElement, {
        onFrame: async () => {
          if (this.pose && videoElement.readyState === 4) {
            await this.pose.send({ image: videoElement });
          }
        },
        width: 1280,
        height: 720,
      });

      await this.camera.start();
      console.log('✅ PoseDetector initialized successfully');
    } catch (error) {
      console.error('❌ PoseDetector initialization failed:', error);
      throw error;
    }
  }

  /**
   * Register callback for pose detection results
   * @param callback - Function to handle pose landmarks
   */
  onResults(callback: (results: PoseResults) => void): void {
    this.onResultsCallback = callback;
  }

  /**
   * Stop camera and clean up resources
   */
  async stop(): Promise<void> {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    if (this.pose) {
      this.pose.close();
      this.pose = null;
    }
    console.log('🛑 PoseDetector stopped');
  }

  /**
   * Check if detector is running
   */
  isRunning(): boolean {
    return this.camera !== null && this.pose !== null;
  }
}
