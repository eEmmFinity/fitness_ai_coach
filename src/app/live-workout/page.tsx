import LiveWorkoutSession from '@/components/vision/LiveWorkoutSession';
import { Card } from '@/components/ui/Card';
import { Sparkles, Lock } from 'lucide-react';

export default function LiveWorkoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero */}
      <Card variant="hero" className="p-0">
        <div className="relative bg-dot-grid">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(700px_350px_at_100%_0%,hsl(165_85%_55%/0.3),transparent_60%)]" />
          <div className="relative px-6 py-7 sm:px-10 sm:py-9">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/15">
              <Sparkles className="h-3 w-3" />
              On-device CV
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Live workout session
            </h1>
            <p className="mt-2 text-white/70 max-w-xl">
              Real-time exercise recognition and form scoring — runs entirely in your browser.
            </p>
          </div>
        </div>
      </Card>

      <LiveWorkoutSession />

      <Card>
        <h2 className="text-base font-semibold mb-3">How to use</h2>
        <ol className="space-y-1.5 list-decimal list-inside text-sm text-muted-foreground">
          <li>Pick an exercise — Squats, Push-ups, or Plank.</li>
          <li>Click <span className="text-foreground font-medium">Start Workout</span> and allow camera access.</li>
          <li>Position yourself so your full body is visible.</li>
          <li>Perform the exercise — reps and form score update live.</li>
          <li>Hit <span className="text-foreground font-medium">Reset</span> to start a fresh set, or <span className="text-foreground font-medium">Stop</span> to save.</li>
        </ol>

        <div className="mt-4 px-3.5 py-3 rounded-md bg-success/10 border border-success/30 text-sm flex items-start gap-2">
          <Lock className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-foreground">Private by default. </span>
            <span className="text-muted-foreground">
              All video processing runs locally — nothing is uploaded.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
