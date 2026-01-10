'use client';

/**
 * LiveWorkoutSession - Real-time exercise recognition component
 * Integrates webcam feed with MediaPipe pose detection and exercise analysis
 * Supports: Squats, Push-ups, Planks
 */

import { useEffect, useRef, useState } from 'react';
import { PoseDetector } from '@/lib/vision/core/poseDetector';
import { SquatDetector } from '@/lib/vision/exercises/squatDetector';
import { PushupDetector } from '@/lib/vision/exercises/pushupDetector';
import { PlankDetector } from '@/lib/vision/exercises/plankDetector';
import type { ExerciseMetrics, FormFeedback } from '@/lib/vision/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RotateCcw } from 'lucide-react';

type ExerciseType = 'squat' | 'pushup' | 'plank';

export default function LiveWorkoutSession() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('squat');

  const [poseDetector] = useState(() => new PoseDetector());
  const [squatDetector] = useState(() => new SquatDetector({ enableFeedback: true }));
  const [pushupDetector] = useState(() => new PushupDetector({ enableFeedback: true }));
  const [plankDetector] = useState(() => new PlankDetector({ enableFeedback: true }));

  const [metrics, setMetrics] = useState<ExerciseMetrics>({
    repCount: 0,
    formScore: 100,
    caloriesBurned: 0,
    duration: 0,
    tempo: 0,
  });
  const [feedback, setFeedback] = useState<FormFeedback[]>([]);

  // Get current detector based on selected exercise
  const getCurrentDetector = () => {
    switch (selectedExercise) {
      case 'squat':
        return squatDetector;
      case 'pushup':
        return pushupDetector;
      case 'plank':
        return plankDetector;
    }
  };

  // Initialize camera and pose detection
  const startWorkout = async () => {
    if (!videoRef.current) return;

    try {
      await poseDetector.initialize(videoRef.current);

      poseDetector.onResults((results) => {
        const detector = getCurrentDetector();
        const newMetrics = detector.process(results);
        setMetrics(newMetrics);
        setFeedback(detector.getRecentFeedback());

        // Draw pose skeleton on canvas
        drawPoseSkeleton(results.poseLandmarks);
      });

      setIsActive(true);
    } catch (error) {
      console.error('Failed to start workout:', error);
      alert('Camera access denied or MediaPipe failed to load');
    }
  };

  // Stop camera and detection
  const stopWorkout = async () => {
    await poseDetector.stop();
    setIsActive(false);
  };

  // Reset current detector
  const resetWorkout = () => {
    getCurrentDetector().reset();
    setMetrics({
      repCount: 0,
      formScore: 100,
      caloriesBurned: 0,
      duration: 0,
      tempo: 0,
    });
    setFeedback([]);
  };

  // Change exercise type
  const changeExercise = (exercise: ExerciseType) => {
    if (isActive) {
      // Reset current detector before switching
      getCurrentDetector().reset();
    }
    setSelectedExercise(exercise);
    setMetrics({
      repCount: 0,
      formScore: 100,
      caloriesBurned: 0,
      duration: 0,
      tempo: 0,
    });
    setFeedback([]);
  };

  // Draw pose skeleton on canvas with highlighted joints (Week 3 enhancement)
  const drawPoseSkeleton = (landmarks: any[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !landmarks) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get affected joints from recent feedback
    const affectedJoints = new Set<number>();
    feedback.forEach((f) => {
      if (f.affectedJoints) {
        f.affectedJoints.forEach((joint) => affectedJoints.add(joint));
      }
    });

    // Draw landmarks with conditional highlighting
    landmarks.forEach((landmark, index) => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;

      // Highlight affected joints in red/orange
      if (affectedJoints.has(index)) {
        ctx.fillStyle = '#ef4444'; // red for problem joints
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI); // Larger circle
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Normal joints in green
        ctx.fillStyle = '#10b981'; // green
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw connections (simplified - just main body)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;

    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
      [11, 23], [12, 24], [23, 24], // Torso
      [23, 25], [25, 27], [24, 26], [26, 28], // Legs
    ];

    connections.forEach(([i, j]) => {
      const start = landmarks[i];
      const end = landmarks[j];
      if (start && end) {
        ctx.beginPath();
        ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
        ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
        ctx.stroke();
      }
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      poseDetector.stop();
    };
  }, [poseDetector]);

  // Get display text for metrics based on exercise type
  const getMetricLabel = () => {
    if (selectedExercise === 'plank') {
      return 'seconds held';
    }
    return selectedExercise === 'squat' ? 'squats' : 'push-ups';
  };

  const getTempoLabel = () => {
    if (selectedExercise === 'plank') {
      return 'N/A';
    }
    return `${metrics.tempo} rpm`;
  };

  return (
    <div className="space-y-6">
      {/* Exercise Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={selectedExercise === 'squat' ? 'default' : 'outline'}
              onClick={() => changeExercise('squat')}
              disabled={isActive}
              className="h-20 flex flex-col gap-1"
            >
              <span className="text-2xl">🏋️</span>
              <span>Squats</span>
            </Button>
            <Button
              variant={selectedExercise === 'pushup' ? 'default' : 'outline'}
              onClick={() => changeExercise('pushup')}
              disabled={isActive}
              className="h-20 flex flex-col gap-1"
            >
              <span className="text-2xl">💪</span>
              <span>Push-ups</span>
            </Button>
            <Button
              variant={selectedExercise === 'plank' ? 'default' : 'outline'}
              onClick={() => changeExercise('plank')}
              disabled={isActive}
              className="h-20 flex flex-col gap-1"
            >
              <span className="text-2xl">🧘</span>
              <span>Plank</span>
            </Button>
          </div>
          {isActive && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Stop the workout to change exercises
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed - Left Column */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Camera Feed</span>
              <div className="flex gap-2">
                {!isActive ? (
                  <Button onClick={startWorkout} className="bg-green-600 hover:bg-green-700">
                    <Camera className="mr-2 h-4 w-4" />
                    Start Workout
                  </Button>
                ) : (
                  <>
                    <Button onClick={resetWorkout} variant="outline">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={stopWorkout} variant="destructive">
                      <CameraOff className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                  <p className="text-2xl font-bold mb-2">
                    Ready to track {selectedExercise === 'squat' ? 'Squats' : selectedExercise === 'pushup' ? 'Push-ups' : 'Plank'}
                  </p>
                  <p className="text-lg">Click "Start Workout" to begin</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metrics Panel - Right Column */}
        <div className="space-y-6">
          {/* Rep Counter / Hold Time */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedExercise === 'plank' ? 'Hold Time' : 'Rep Counter'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-primary text-center">
                {metrics.repCount}
              </div>
              <p className="text-center text-muted-foreground mt-2">{getMetricLabel()}</p>
            </CardContent>
          </Card>

          {/* Form Score */}
          <Card>
            <CardHeader>
              <CardTitle>Form Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - metrics.formScore / 100)}`}
                    className={
                      metrics.formScore >= 80
                        ? 'text-green-500'
                        : metrics.formScore >= 60
                        ? 'text-yellow-500'
                        : 'text-red-500'
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{metrics.formScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">{metrics.duration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tempo</span>
                <span className="font-semibold">{getTempoLabel()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-semibold">{metrics.caloriesBurned} kcal</span>
              </div>
            </CardContent>
          </Card>

          {/* Live Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Live Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {feedback.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No feedback yet</p>
                ) : (
                  feedback.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded text-sm ${
                        item.severity === 'good'
                          ? 'bg-green-900/20 text-green-400'
                          : item.severity === 'warning'
                          ? 'bg-yellow-900/20 text-yellow-400'
                          : 'bg-red-900/20 text-red-400'
                      }`}
                    >
                      {item.message}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
