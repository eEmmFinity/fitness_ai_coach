import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import type { PoseResults } from '../types';

export class PoseDetector {
  private pose: Pose | null = null;
  private camera: Camera | null = null;
  private onResultsCallback: ((results: PoseResults) => void) | null = null;
  private initializing = false;

  async initialize(videoElement: HTMLVideoElement): Promise<void> {
    // Fix #5: guard against concurrent calls
    if (this.initializing || this.isRunning()) return;
    this.initializing = true;

    try {
      this.pose = new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      this.pose.onResults((results: Results) => {
        if (this.onResultsCallback && results.poseLandmarks) {
          // Fix #9: pass world landmarks so detectors can use 3D metric coordinates
          this.onResultsCallback({
            poseLandmarks: results.poseLandmarks,
            poseWorldLandmarks: results.poseWorldLandmarks,
          });
        }
      });

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
    } finally {
      this.initializing = false;
    }
  }

  onResults(callback: (results: PoseResults) => void): void {
    this.onResultsCallback = callback;
  }

  async stop(): Promise<void> {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    if (this.pose) {
      this.pose.close();
      this.pose = null;
    }
  }

  isRunning(): boolean {
    return this.camera !== null && this.pose !== null;
  }

  isInitializing(): boolean {
    return this.initializing;
  }
}
