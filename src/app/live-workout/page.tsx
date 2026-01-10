import LiveWorkoutSession from '@/components/vision/LiveWorkoutSession';

export default function LiveWorkoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Live Workout Session
        </h1>
        <p className="text-muted-foreground">
          Real-time exercise recognition with AI-powered form correction
        </p>
      </div>

      <LiveWorkoutSession />

      {/* Instructions */}
      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
          <li>Click "Start Workout" to enable your camera</li>
          <li>Position yourself so your full body is visible in the frame</li>
          <li>Start performing squats - the system will automatically count reps</li>
          <li>Watch the form score and follow real-time feedback to improve technique</li>
          <li>Click "Reset" to start a new set or "Stop" to end the session</li>
        </ol>

        <div className="mt-4 p-4 bg-yellow-900/20 text-yellow-400 rounded-md">
          <p className="font-semibold">Privacy Note:</p>
          <p className="text-sm">
            All video processing happens locally in your browser. No video data is sent to servers.
          </p>
        </div>
      </div>
    </div>
  );
}
