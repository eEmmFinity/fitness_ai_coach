'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PoseDetector } from '@/lib/vision/core/poseDetector';
import { SquatDetector } from '@/lib/vision/exercises/squatDetector';
import { PushupDetector } from '@/lib/vision/exercises/pushupDetector';
import { PlankDetector } from '@/lib/vision/exercises/plankDetector';
import type { ExerciseMetrics, FormFeedback, PoseLandmark } from '@/lib/vision/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Camera, CameraOff, RotateCcw, Loader2 } from 'lucide-react';

type ExerciseType = 'squat' | 'pushup' | 'plank';

const EMPTY_METRICS: ExerciseMetrics = {
  repCount: 0,
  formScore: 100,
  caloriesBurned: 0,
  duration: 0,
  tempo: 0,
};

export default function LiveWorkoutSession() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix #6: track stable canvas dimensions so we only set them once
  const canvasSizeSetRef = useRef(false);
  // Fix #12: rAF handle for decoupled draw scheduling
  const rafRef = useRef<number | null>(null);
  // Pending landmarks to draw, written by onResults, consumed by rAF
  const pendingLandmarksRef = useRef<PoseLandmark[] | null>(null);

  const [isActive, setIsActive]           = useState(false);
  // Fix #5/#13: separate loading state so button is disabled during WASM init
  const [isLoading, setIsLoading]         = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('squat');
  const [metrics, setMetrics]             = useState<ExerciseMetrics>(EMPTY_METRICS);
  const [feedback, setFeedback]           = useState<FormFeedback[]>([]);
  const [cameraError, setCameraError]     = useState<string | null>(null);

  const poseDetectorRef   = useRef(new PoseDetector());
  const squatDetectorRef  = useRef(new SquatDetector({ enableFeedback: true }));
  const pushupDetectorRef = useRef(new PushupDetector({ enableFeedback: true }));
  const plankDetectorRef  = useRef(new PlankDetector({ enableFeedback: true }));

  // selectedExercise ref so the onResults closure always reads the current value
  const selectedExerciseRef = useRef<ExerciseType>('squat');
  useEffect(() => {
    selectedExerciseRef.current = selectedExercise;
  }, [selectedExercise]);

  const getCurrentDetector = useCallback(() => {
    switch (selectedExerciseRef.current) {
      case 'squat':  return squatDetectorRef.current;
      case 'pushup': return pushupDetectorRef.current;
      case 'plank':  return plankDetectorRef.current;
    }
  }, []);

  // Fix #12: canvas draw runs inside rAF, decoupled from the MediaPipe callback
  const scheduleDrawFrame = useCallback((landmarks: PoseLandmark[]) => {
    pendingLandmarksRef.current = landmarks;

    if (rafRef.current !== null) return; // already scheduled

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const toRender = pendingLandmarksRef.current;
      if (toRender) drawPoseSkeleton(toRender);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawPoseSkeleton = (landmarks: PoseLandmark[]) => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video || !landmarks.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fix #6: only set dimensions when they first stabilise — avoids per-frame GPU reset
    if (
      !canvasSizeSetRef.current &&
      video.videoWidth > 0 &&
      video.videoHeight > 0
    ) {
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasSizeSetRef.current = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const affectedJoints = new Set<number>();
    getCurrentDetector().getRecentFeedback().forEach((f) => {
      f.affectedJoints?.forEach((j) => affectedJoints.add(j));
    });

    landmarks.forEach((landmark, index) => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;

      if (affectedJoints.has(index)) {
        ctx.shadowBlur  = 10;
        ctx.shadowColor = '#ef4444';
        ctx.fillStyle   = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth   = 2;

    const connections: [number, number][] = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
      [11, 23], [12, 24], [23, 24],
      [23, 25], [25, 27], [24, 26], [26, 28],
    ];

    connections.forEach(([i, j]) => {
      const start = landmarks[i];
      const end   = landmarks[j];
      if (start && end) {
        ctx.beginPath();
        ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
        ctx.lineTo(end.x  * canvas.width, end.y  * canvas.height);
        ctx.stroke();
      }
    });
  };

  const startWorkout = async () => {
    // Fix #5: prevent concurrent init (double-click race)
    if (isLoading || isActive) return;

    setCameraError(null);
    setIsLoading(true); // Fix #13: show loading state immediately

    try {
      await poseDetectorRef.current.initialize(videoRef.current!);

      poseDetectorRef.current.onResults((results) => {
        const detector   = getCurrentDetector();
        const newMetrics = detector.process(results);
        setMetrics(newMetrics);
        setFeedback(detector.getRecentFeedback());
        // Fix #12: schedule draw via rAF instead of blocking the callback
        scheduleDrawFrame(results.poseLandmarks);
      });

      setIsActive(true);
    } catch {
      setCameraError(
        'Camera access denied or pose detection failed to load. Please allow camera access and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stopWorkout = async () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Save session before stopping — fire-and-forget, don't block the UI
    if (metrics.duration >= 5) {
      fetch('/api/workout-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseType: selectedExerciseRef.current,
          repCount: metrics.repCount,
          formScore: metrics.formScore,
          caloriesBurned: metrics.caloriesBurned,
          duration: metrics.duration,
          tempo: metrics.tempo,
        }),
      }).catch(() => {
        // Silent — session history is a nice-to-have; don't disrupt the workout UX
      });
    }

    await poseDetectorRef.current.stop();
    canvasSizeSetRef.current = false;
    setIsActive(false);
  };

  const resetWorkout = () => {
    getCurrentDetector().reset();
    setMetrics(EMPTY_METRICS);
    setFeedback([]);
  };

  const changeExercise = (exercise: ExerciseType) => {
    if (isActive) getCurrentDetector().reset();
    setSelectedExercise(exercise);
    setMetrics(EMPTY_METRICS);
    setFeedback([]);
  };

  useEffect(() => {
    const detector = poseDetectorRef.current;
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      detector.stop();
    };
  }, []);

  const getMetricLabel = () => {
    if (selectedExercise === 'plank') return 'seconds held';
    return selectedExercise === 'squat' ? 'squats' : 'push-ups';
  };

  const getTempoLabel = () => {
    if (selectedExercise === 'plank') return 'N/A';
    return `${metrics.tempo} rpm`;
  };

  const exerciseDisplayName =
    selectedExercise === 'squat' ? 'Squats'
    : selectedExercise === 'pushup' ? 'Push-ups'
    : 'Plank';

  return (
    <div className="space-y-6">
      {/* Exercise Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {(['squat', 'pushup', 'plank'] as ExerciseType[]).map((ex) => (
              <Button
                key={ex}
                variant={selectedExercise === ex ? 'primary' : 'outline'}
                onClick={() => changeExercise(ex)}
                disabled={isActive || isLoading}
                className="h-20 flex flex-col gap-1"
              >
                <span className="text-2xl">
                  {ex === 'squat' ? '🏋️' : ex === 'pushup' ? '💪' : '🧘'}
                </span>
                <span>
                  {ex === 'squat' ? 'Squats' : ex === 'pushup' ? 'Push-ups' : 'Plank'}
                </span>
              </Button>
            ))}
          </div>
          {isActive && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Stop the workout to change exercises
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Camera Feed</span>
              <div className="flex gap-2">
                {!isActive ? (
                  <Button
                    onClick={startWorkout}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 min-w-[160px]"
                  >
                    {/* Fix #13: show spinner + status during WASM load */}
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading AI...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Workout
                      </>
                    )}
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
            {cameraError && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
                {cameraError}
              </div>
            )}
            {/* Fix #13: loading overlay while WASM + model download */}
            {isLoading && (
              <div className="mb-4 p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 text-blue-400 text-sm flex items-start gap-3">
                <Loader2 className="h-5 w-5 animate-spin flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Loading pose detection model…</p>
                  <p className="mt-1 text-blue-400/70">
                    Downloading AI model (~5 MB). This only happens once per session.
                  </p>
                </div>
              </div>
            )}
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
              {!isActive && !isLoading && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                  <p className="text-2xl font-bold mb-2">
                    Ready to track {exerciseDisplayName}
                  </p>
                  <p className="text-lg">Click &quot;Start Workout&quot; to begin</p>
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/60">
                  <Loader2 className="h-12 w-12 animate-spin mb-3 text-blue-400" />
                  <p className="text-lg font-semibold">Initialising camera &amp; AI…</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metrics Panel */}
        <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Form Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="currentColor" strokeWidth="8" fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - metrics.formScore / 100)}`}
                    className={
                      metrics.formScore >= 80 ? 'text-green-500'
                      : metrics.formScore >= 60 ? 'text-yellow-500'
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

          <Card>
            <CardHeader>
              <CardTitle>Live Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {feedback.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No feedback yet</p>
                ) : (
                  feedback.map((item) => (
                    // Fix #15: use timestamp as stable key — avoids reconciliation flicker
                    <div
                      key={item.timestamp}
                      className={`p-2 rounded text-sm ${
                        item.severity === 'good'    ? 'bg-green-900/20 text-green-400'
                        : item.severity === 'warning' ? 'bg-yellow-900/20 text-yellow-400'
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
