# UI Mockups: Real-Time Exercise Recognition Feature
## Fitness AI Coach - Computer Vision Integration

**Document Version:** 2.0
**Date:** January 10, 2025
**Design System:** Tailwind CSS + Custom Purple Theme
**Target Devices:** Desktop (1920x1080), Tablet (768px), Mobile (375px)

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [UI Mockup 1: Live Workout Session](#ui-mockup-1-live-workout-session)
3. [UI Mockup 2: Pre-Workout Setup](#ui-mockup-2-pre-workout-setup)
4. [UI Mockup 3: Post-Workout Analysis](#ui-mockup-3-post-workout-analysis)
5. [UI Mockup 4: Dashboard Integration](#ui-mockup-4-dashboard-integration)
6. [UI Mockup 5: Mobile Responsive Views](#ui-mockup-5-mobile-responsive-views)
7. [Component Specifications](#component-specifications)
8. [Design System Extensions](#design-system-extensions)

---

## Design Philosophy

### Consistency with Existing App
- **Primary Color**: `hsl(262 83% 58%)` (Purple) - Already used throughout app
- **Gradients**: `from-primary/10 via-background to-secondary/10`
- **Card Style**: Glassmorphism with `border-border hover:border-primary`
- **Typography**: Same font hierarchy as dashboard
- **Icons**: Lucide React icons (matching existing components)

### Novel Elements for CV Feature
- **Real-time Indicators**: Pulsing borders, live status badges
- **Form Score Visualization**: Circular progress rings (0-100%)
- **Pose Skeleton Overlay**: Color-coded green/yellow/red based on form
- **Video Feed**: Full-screen option with PiP (Picture-in-Picture) support

---

## UI Mockup 1: Live Workout Session

### Desktop Layout (1920x1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [< Back to Dashboard]                    LIVE WORKOUT         [⏸ Pause] [⏹ Stop]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────┐  ┌────────────────────────┐  │
│  │                                        │  │  CURRENT EXERCISE      │  │
│  │        VIDEO FEED AREA                 │  │  ────────────────────  │  │
│  │     (1280x720 - 16:9 ratio)            │  │                        │  │
│  │                                        │  │    🔴 SQUAT           │  │
│  │   ┌──────────────────────┐             │  │                        │  │
│  │   │   [Pose Skeleton]    │             │  │  ┌─────────────────┐  │  │
│  │   │    Green/Yellow/Red  │             │  │  │      REPS       │  │
│  │   │    Lines Overlay     │             │  │  │                 │  │
│  │   │                      │             │  │  │       24        │  │
│  │   │      👤              │             │  │  │                 │  │
│  │   │     /│\              │             │  │  │   Target: 30    │  │
│  │   │    / │ \             │             │  │  └─────────────────┘  │
│  │   │     / \              │             │  │                        │  │
│  │   └──────────────────────┘             │  │  ┌─────────────────┐  │  │
│  │                                        │  │  │   FORM SCORE    │  │
│  │                                        │  │  │                 │  │
│  │  [🎥 30 FPS] [✅ Tracking Good]        │  │  │      ████░░     │  │
│  └────────────────────────────────────────┘  │  │       92%       │  │
│                                              │  │                 │  │
│  ┌────────────────────────────────────────┐  │  │  Excellent!     │  │
│  │  REAL-TIME FEEDBACK                    │  │  └─────────────────┘  │
│  │  ──────────────────────────────────────│  │                        │
│  │                                        │  │  ┌─────────────────┐  │
│  │  ✅ Great squat depth! Keep it up.    │  │  │   CALORIES      │  │
│  │  💪 Knees aligned with toes - perfect!│  │  │                 │  │
│  │  ⚠️  Keep your chest up on next rep   │  │  │   🔥 87 kcal    │  │
│  │                                        │  │  │                 │  │
│  │  [💬 Ask AI Coach]                     │  │  └─────────────────┘  │
│  └────────────────────────────────────────┘  │                        │
│                                              │  ⏱️ Duration: 5:32     │
│  ┌────────────────────────────────────────┐  │  🎯 Set: 2 of 3       │
│  │  CURRENT PHASE: DESCENDING             │  └────────────────────────┘
│  │  [████████░░░░] Target angle: 90°      │
│  │  Current: 95° → 5° more                │
│  └────────────────────────────────────────┘
│                                                                             │
│  [🎤 Voice Commands ON]  [📹 Record Session]  [🔄 Switch Exercise]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Color Coding System

**Pose Skeleton Overlay:**
- 🟢 **Green Lines**: Form is correct (>85% score)
- 🟡 **Yellow Lines**: Minor issues (70-85% score)
- 🔴 **Red Lines**: Critical form problems (<70% score)

**Feedback Messages:**
- ✅ **Green Checkmark**: Positive reinforcement
- ⚠️ **Yellow Warning**: Minor correction needed
- 🚫 **Red Alert**: Critical form issue (stop and correct)

**Real-Time Status:**
- 🔴 **Red Pulse**: Recording active
- 🟢 **Green Pulse**: Pose tracking active
- 🟡 **Yellow Pulse**: Low confidence detection

---

## UI Mockup 2: Pre-Workout Setup

### Camera Setup & Calibration Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WORKOUT SESSION SETUP                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Step 1 of 3: Camera Positioning                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                             │
│  ┌───────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │                                   │  │  POSITIONING GUIDE           │  │
│  │     VIDEO FEED PREVIEW            │  │  ─────────────────────────   │  │
│  │                                   │  │                              │  │
│  │   ┌─────────────────────┐         │  │  ✅ Full body visible       │  │
│  │   │                     │         │  │  ✅ Good lighting           │  │
│  │   │   Detection Zone    │         │  │  ⚠️  Move back 1 foot       │  │
│  │   │   [Outline shown]   │         │  │  ❌ Camera angle too low    │  │
│  │   │                     │         │  │                              │  │
│  │   │        👤           │         │  │  RECOMMENDED SETUP:          │  │
│  │   │       /│\           │         │  │  • Distance: 6-8 feet        │  │
│  │   │      / │ \          │         │  │  • Height: Waist level       │  │
│  │   │       / \           │         │  │  • Angle: Straight on        │  │
│  │   └─────────────────────┘         │  │  • Lighting: Front/side      │  │
│  │                                   │  │                              │  │
│  │  Visibility Score: 85%            │  │  [📸 See Example Photo]      │  │
│  └───────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Step 2: Select Exercise Type                                       │  │
│  │  ────────────────────────────────────────────────────────────────   │  │
│  │                                                                      │  │
│  │  [Squats]  [Push-ups]  [Planks]  [Bicep Curls]  [Lunges]           │  │
│  │                                                                      │  │
│  │  Selected: Squats (3 sets × 30 reps)                                │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Step 3: Privacy Settings                                           │  │
│  │  ────────────────────────────────────────────────────────────────   │  │
│  │                                                                      │  │
│  │  ☑️ Process video locally (no upload)                               │  │
│  │  ☐ Record session for review (stored on device)                    │  │
│  │  ☐ Enable background blur                                          │  │
│  │  ☑️ Store only pose landmarks (not video)                           │  │
│  │                                                                      │  │
│  │  🔒 Your privacy is protected. Video never leaves your device.      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [< Back]                                          [Start Workout →]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## UI Mockup 3: Post-Workout Analysis

### Session Summary Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  WORKOUT ANALYSIS - January 10, 2025                      [📤 Share] [📥 Save]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  OVERALL PERFORMANCE                                               │   │
│  │  ──────────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │ 🎯 92%   │  │ 🔥 245   │  │ ⏱️ 32    │  │ 💪 127   │           │   │
│  │  │ Form     │  │ Calories │  │ Minutes  │  │ Total    │           │   │
│  │  │ Score    │  │          │  │          │  │ Reps     │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │   │
│  │                                                                     │   │
│  │  ⬆️ +5% improvement from last week                                  │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  EXERCISE BREAKDOWN                                                │   │
│  │  ──────────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │  ┌───────────────┬────────┬────────┬──────────┬─────────────────┐ │   │
│  │  │ Exercise      │ Sets   │ Reps   │ Form     │ Calories        │ │   │
│  │  ├───────────────┼────────┼────────┼──────────┼─────────────────┤ │   │
│  │  │ 🏋️ Squats     │ 3      │ 45     │ 94% ✅   │ 95 kcal         │ │   │
│  │  │ 💪 Push-ups   │ 3      │ 30     │ 78% ⚠️   │ 68 kcal         │ │   │
│  │  │ 🧘 Plank      │ 3×60s  │ --     │ 96% ✅   │ 42 kcal         │ │   │
│  │  │ 🏋️ Bicep Curl │ 3      │ 40     │ 89% ✅   │ 40 kcal         │ │   │
│  │  └───────────────┴────────┴────────┴──────────┴─────────────────┘ │   │
│  │                                                                     │   │
│  │  [📊 View Detailed Form Analysis]                                  │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  AI COACH ANALYSIS                                                 │   │
│  │  ──────────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │  🤖 Great workout today! Here are my observations:                 │   │
│  │                                                                     │   │
│  │  ✅ STRENGTHS:                                                      │   │
│  │  • Excellent squat form - you maintained good depth throughout     │   │
│  │    all sets. Your knees stayed aligned with toes perfectly.        │   │
│  │  • Plank hold was strong with minimal hip sagging.                 │   │
│  │                                                                     │   │
│  │  ⚠️ AREAS TO IMPROVE:                                               │   │
│  │  • Push-up form needs work. I noticed your hips sagging in the     │   │
│  │    last 2 sets of push-ups (Form score dropped to 72%).            │   │
│  │  • Try engaging your core more during the descent phase.           │   │
│  │                                                                     │   │
│  │  💡 RECOMMENDATIONS:                                                │   │
│  │  • Add plank variations to strengthen your core for better         │   │
│  │    push-up performance.                                            │   │
│  │  • Consider doing push-ups on knees until core strength improves.  │   │
│  │  • Watch this tutorial: [Link to push-up form video]               │   │
│  │                                                                     │   │
│  │  📈 PROGRESS TRACKING:                                              │   │
│  │  • Overall form score: 87% → 92% (+5% in 7 days!)                  │   │
│  │  • You're on track to hit your goal. Keep it up!                   │   │
│  │                                                                     │   │
│  │  [💬 Ask Follow-up Questions]  [📅 Plan Next Workout]              │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  FORM SCORE OVER TIME                                              │   │
│  │  ──────────────────────────────────────────────────────────────────│   │
│  │                                                                     │   │
│  │   100%│                                          ●                  │   │
│  │      │                                    ●           ●             │   │
│  │   90%│                          ●                                   │   │
│  │      │                    ●                                         │   │
│  │   80%│              ●                                               │   │
│  │      │        ●                                                     │   │
│  │   70%│  ●                                                           │   │
│  │      └──────────────────────────────────────────────────────       │   │
│  │        1/3   1/5   1/7   1/8   1/9   1/10  (Today)                 │   │
│  │                                                                     │   │
│  │  Your form has improved by 27% over the last 7 days! 🎉            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [< Back to Dashboard]          [🔄 Start New Workout]                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## UI Mockup 4: Dashboard Integration

### Enhanced Dashboard with CV Feature Entry Point

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Welcome back, Emon! 👋                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [BMI: 23.4]  [Daily Calories: 2450 kcal]  [Weight: 75 kg]  [Goal: Build]  │
│                                                                             │
│  ┌──────────────────────────────────────┐  ┌────────────────────────────┐ │
│  │  🎯 Quick Actions                    │  │  📊 This Week              │ │
│  │  ────────────────────────────────────│  │  ──────────────────────    │ │
│  │                                      │  │                            │ │
│  │  ┌────────────────────────────────┐  │  │  Workouts: 5 of 5 ✅       │ │
│  │  │  🎥 START LIVE WORKOUT         │  │  │  Calories: 1,245 🔥        │ │
│  │  │                                │  │  │  Avg Form: 89% 📈          │ │
│  │  │  Real-time form tracking &     │  │  │  Streak: 12 days 🔥        │ │
│  │  │  AI-powered coaching           │  │  └────────────────────────────┘ │
│  │  │                                │  │                                 │
│  │  │  [🚀 START NOW →]              │  │  ┌────────────────────────────┐ │
│  │  └────────────────────────────────┘  │  │  🏆 Recent Achievement     │ │
│  │                                      │  │  ──────────────────────    │ │
│  │  [📋 Workout Plan]                   │  │                            │ │
│  │  [💬 AI Coach Chat]                  │  │  Form Master 🎯            │ │
│  │  [🧮 Calculators]                    │  │  Maintained 90%+ form      │ │
│  │                                      │  │  for 7 consecutive days!   │ │
│  └──────────────────────────────────────┘  └────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  📈 FORM SCORE HISTORY (Last 30 Days)                               │  │
│  │  ───────────────────────────────────────────────────────────────    │  │
│  │                                                                      │  │
│  │   [Line graph showing form score improvement from 65% → 92%]        │  │
│  │                                                                      │  │
│  │  Best Exercise: Squats (96% avg)                                    │  │
│  │  Needs Work: Push-ups (78% avg)                                     │  │
│  │                                                                      │  │
│  │  [View Detailed Analytics →]                                        │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Navigation Menu (Updated)

```
┌──────────────────────────────────────┐
│  🏠 Dashboard                        │
│  🎥 Live Workout (NEW)               │
│  📋 Workout Plan                     │
│  💬 AI Coach                         │
│  🧮 Calculators                      │
│  📊 Progress & Analytics (NEW)       │
│  👤 Profile                          │
│  ⚙️ Settings                         │
└──────────────────────────────────────┘
```

---

## UI Mockup 5: Mobile Responsive Views

### Mobile Layout (375px width)

#### Live Workout Session (Mobile)

```
┌─────────────────────────────┐
│ ← LIVE WORKOUT     ⏸ ⏹     │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │   VIDEO FEED        │    │
│  │   (9:16 portrait)   │    │
│  │                     │    │
│  │   [Pose Skeleton]   │    │
│  │                     │    │
│  │       👤            │    │
│  │      /│\            │    │
│  │     / │ \           │    │
│  │      / \            │    │
│  │                     │    │
│  └─────────────────────┘    │
│                             │
│  🔴 SQUAT                   │
│                             │
│  ┌───────────────────────┐  │
│  │  REPS: 24/30          │  │
│  │  FORM: 92% ████░░     │  │
│  │  CALORIES: 87 kcal    │  │
│  └───────────────────────┘  │
│                             │
│  FEEDBACK:                  │
│  ✅ Great depth!            │
│  ⚠️ Keep chest up           │
│                             │
│  [💬 Ask AI] [🔄 Switch]    │
└─────────────────────────────┘
```

#### Mobile Pre-Workout Setup

```
┌─────────────────────────────┐
│ ← SETUP WORKOUT             │
├─────────────────────────────┤
│                             │
│  Step 1/3: Camera Position  │
│  ━━━━━━━━━━━━━━━━━━━━━━━  │
│                             │
│  ┌─────────────────────┐    │
│  │   CAMERA PREVIEW    │    │
│  │                     │    │
│  │   [Detection Zone]  │    │
│  │                     │    │
│  │        👤           │    │
│  └─────────────────────┘    │
│                             │
│  ✅ Full body visible       │
│  ✅ Good lighting           │
│  ⚠️ Move back 2 feet        │
│                             │
│  [Continue →]               │
└─────────────────────────────┘
```

---

## Component Specifications

### Component 1: `ExerciseCameraView.tsx`

**Location:** `src/components/vision/ExerciseCameraView.tsx`

**Props Interface:**
```typescript
interface ExerciseCameraViewProps {
  exerciseType: 'squat' | 'pushup' | 'plank' | 'bicep_curl' | 'lunge'
  targetReps: number
  targetSets: number
  onSessionComplete: (session: WorkoutSession) => void
  onPause?: () => void
  onStop?: () => void
}
```

**Key Features:**
- Real-time video feed with pose overlay
- Rep counter with progress bar
- Form score circular progress ring
- Live feedback message stream
- AI coach integration button
- Session controls (pause, stop, switch exercise)

**State Management:**
```typescript
const [repCount, setRepCount] = useState(0)
const [formScore, setFormScore] = useState(100)
const [feedbackMessages, setFeedbackMessages] = useState<Feedback[]>([])
const [currentPhase, setCurrentPhase] = useState<'up' | 'down' | 'hold'>('up')
const [caloriesBurned, setCaloriesBurned] = useState(0)
const [sessionDuration, setSessionDuration] = useState(0)
const [isPaused, setIsPaused] = useState(false)
```

---

### Component 2: `PreWorkoutSetup.tsx`

**Location:** `src/components/vision/PreWorkoutSetup.tsx`

**Props Interface:**
```typescript
interface PreWorkoutSetupProps {
  onSetupComplete: (config: WorkoutConfig) => void
  workoutPlan?: WorkoutPlan
}

interface WorkoutConfig {
  exerciseType: ExerciseType
  sets: number
  reps: number
  privacySettings: PrivacySettings
  cameraPosition: CameraPosition
}
```

**Key Features:**
- Step-by-step wizard (3 steps)
- Camera positioning guide with visual indicators
- Exercise selection from workout plan
- Privacy settings toggle
- Real-time camera feed preview
- Position validation (visibility score)

---

### Component 3: `PostWorkoutAnalysis.tsx`

**Location:** `src/components/vision/PostWorkoutAnalysis.tsx`

**Props Interface:**
```typescript
interface PostWorkoutAnalysisProps {
  session: WorkoutSession
  onStartNewWorkout?: () => void
  onAskAI?: (context: string) => void
}

interface WorkoutSession {
  id: string
  userId: string
  startTime: Date
  endTime: Date
  exercises: ExerciseSession[]
  totalCalories: number
  averageFormScore: number
  aiAnalysis?: AIAnalysis
}
```

**Key Features:**
- Overall performance summary cards
- Exercise-by-exercise breakdown table
- AI coach analysis with recommendations
- Form score trend graph (last 7/30 days)
- Share/export functionality
- "Ask AI follow-up questions" integration

---

### Component 4: `FormScoreRing.tsx`

**Location:** `src/components/vision/FormScoreRing.tsx`

**Reusable circular progress indicator**

```typescript
interface FormScoreRingProps {
  score: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}
```

**Visual Specification:**
- SVG circular progress ring
- Color gradient based on score:
  - 90-100: Green (`#10b981`)
  - 70-89: Yellow (`#f59e0b`)
  - 0-69: Red (`#ef4444`)
- Smooth animation on score updates
- Optional percentage label in center

---

### Component 5: `PoseOverlay.tsx`

**Location:** `src/components/vision/PoseOverlay.tsx`

**Canvas-based pose skeleton overlay**

```typescript
interface PoseOverlayProps {
  landmarks: PoseLandmark[]
  canvasRef: React.RefObject<HTMLCanvasElement>
  formIssues: FormIssue[]
  highlightJoints?: number[] // Landmark indices to highlight
}
```

**Rendering Logic:**
- Draw skeleton using MediaPipe connections
- Color code based on form issues:
  - Green: No issues on this joint
  - Yellow: Minor issue
  - Red: Critical issue
- Joint dots with visibility indicators
- Angle indicators for form feedback

---

### Component 6: `LiveFeedbackPanel.tsx`

**Location:** `src/components/vision/LiveFeedbackPanel.tsx`

**Scrolling feedback message stream**

```typescript
interface LiveFeedbackPanelProps {
  feedbackMessages: FeedbackMessage[]
  maxMessages?: number // Default: 5
  autoScroll?: boolean
}

interface FeedbackMessage {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  timestamp: Date
}
```

**Features:**
- Auto-scroll to latest message
- Color-coded by severity
- Icon indicators (✅ ⚠️ 🚫 💡)
- Fade-out animation for old messages
- Max height with overflow scroll

---

## Design System Extensions

### New CSS Variables

Add to `globals.css`:

```css
:root {
  /* Exercise Recognition Colors */
  --form-excellent: 142 71% 45%; /* Green for 90-100% */
  --form-good: 45 93% 47%; /* Yellow for 70-89% */
  --form-poor: 0 84% 60%; /* Red for 0-69% */

  /* Live Status Indicators */
  --status-recording: 0 84% 60%; /* Red pulse */
  --status-tracking: 142 71% 45%; /* Green pulse */
  --status-paused: 45 93% 47%; /* Yellow */

  /* Overlay Colors */
  --overlay-bg: 0 0% 0% / 0.7; /* Semi-transparent black */
  --skeleton-green: 142 71% 45%;
  --skeleton-yellow: 45 93% 47%;
  --skeleton-red: 0 84% 60%;
}
```

### New Animation Classes

```css
/* Pulse Animation for Live Indicators */
.pulse-red {
  animation: pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-red {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

/* Progress Ring Animation */
.progress-ring-circle {
  transition: stroke-dashoffset 0.35s ease-in-out;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

/* Skeleton Overlay Fade */
.skeleton-overlay {
  animation: skeleton-fade-in 0.3s ease-out;
}

@keyframes skeleton-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.9;
  }
}

/* Feedback Message Slide */
.feedback-slide-in {
  animation: slide-in-right 0.3s ease-out;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Icon System (Lucide React)

**New Icons to Import:**
```typescript
import {
  Video,           // Camera/video feed
  VideoOff,        // Camera disabled
  Play,            // Start workout
  Pause,           // Pause session
  StopCircle,      // Stop session
  RefreshCw,       // Switch exercise
  Camera,          // Camera setup
  Maximize2,       // Fullscreen
  Minimize2,       // Exit fullscreen
  Mic,             // Voice commands
  MicOff,          // Mute
  AlertTriangle,   // Warning
  CheckCircle2,    // Success
  XCircle,         // Error
  Info,            // Information
  Zap,             // Real-time indicator
  Activity,        // Form tracking
  TrendingUp,      // Progress
  Eye,             // Visibility
  EyeOff,          // Hidden
} from 'lucide-react'
```

---

## Responsive Breakpoints

### Desktop (1280px+)
- Full side-by-side layout (video + stats panel)
- Large video feed (1280x720 or 16:9 aspect ratio)
- All features visible simultaneously
- Dual-column feedback area

### Tablet (768px - 1279px)
- Stacked layout (video on top, stats below)
- Medium video feed (960x540)
- Collapsible feedback panel
- Reduced font sizes

### Mobile (320px - 767px)
- Single column layout
- Portrait video feed (9:16 aspect ratio)
- Bottom sheet for stats (swipe up to expand)
- Compact feedback messages
- Floating action buttons for controls

### Media Query Structure

```css
/* Mobile First Approach */
.exercise-camera-view {
  /* Base styles for mobile */
}

@media (min-width: 768px) {
  /* Tablet styles */
  .exercise-camera-view {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1280px) {
  /* Desktop styles */
  .exercise-camera-view {
    grid-template-columns: 2fr 1fr;
  }
}
```

---

## Accessibility Considerations

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- All controls accessible via Tab key
- Space/Enter to activate buttons
- Escape to exit fullscreen
- Arrow keys for exercise switching

**Screen Reader Support:**
- ARIA labels for all interactive elements
- Live region for feedback messages
- Status announcements for rep counts
- Descriptive alt text for visual indicators

**Color Contrast:**
- All text meets 4.5:1 contrast ratio
- Form score indicators have text fallbacks
- Icons paired with text labels
- High contrast mode support

**Focus Indicators:**
- Visible focus ring on all interactive elements
- Skip to main content link
- Focus trap in modal dialogs

---

## Performance Optimizations

### Video Feed
- Reduce resolution to 640x480 on low-end devices
- Adaptive FPS (30fps → 15fps if CPU usage >80%)
- Canvas rendering optimizations (requestAnimationFrame)

### State Management
- Debounce feedback message updates (100ms)
- Throttle form score calculations (200ms)
- Use React.memo for expensive components
- Virtual scrolling for long feedback history

### Bundle Size
- Lazy load MediaPipe library (code splitting)
- Dynamic import for CV components
- Tree-shake unused Lucide icons
- Optimize pose detection model size

---

## Error States & Edge Cases

### Camera Permission Denied
```
┌─────────────────────────────────────┐
│  📹 Camera Access Required          │
│  ───────────────────────────────    │
│                                     │
│  To use live workout tracking,      │
│  please enable camera permissions.  │
│                                     │
│  [⚙️ Enable Camera]                 │
│  [← Use Regular Workout Plan]       │
└─────────────────────────────────────┘
```

### Poor Lighting Detected
```
┌─────────────────────────────────────┐
│  ⚠️ Low Visibility                  │
│  ───────────────────────────────    │
│                                     │
│  We can only see 45% of your body.  │
│                                     │
│  💡 Improve lighting or reposition  │
│     camera for better tracking.     │
│                                     │
│  [Continue Anyway] [Retry Setup]    │
└─────────────────────────────────────┘
```

### MediaPipe Load Failure
```
┌─────────────────────────────────────┐
│  🚫 Pose Detection Unavailable      │
│  ───────────────────────────────    │
│                                     │
│  Failed to load pose detection.     │
│  Check your internet connection.    │
│                                     │
│  [🔄 Retry]                         │
│  [← Use Manual Tracking]            │
└─────────────────────────────────────┘
```

---

## User Flow Diagram

```
START
  │
  ├─→ Dashboard
  │     │
  │     ├─→ Click "START LIVE WORKOUT"
  │     │     │
  │     │     └─→ PreWorkoutSetup.tsx
  │     │           │
  │     │           ├─→ Step 1: Camera Position
  │     │           ├─→ Step 2: Exercise Selection
  │     │           ├─→ Step 3: Privacy Settings
  │     │           │
  │     │           └─→ "Start Workout" button
  │     │                 │
  │     │                 └─→ ExerciseCameraView.tsx
  │     │                       │
  │     │                       ├─→ Real-time pose detection
  │     │                       ├─→ Rep counting
  │     │                       ├─→ Form analysis
  │     │                       ├─→ Live AI feedback
  │     │                       │
  │     │                       ├─→ [Pause] → Resume or Stop
  │     │                       │
  │     │                       └─→ [Stop] → PostWorkoutAnalysis.tsx
  │     │                                      │
  │     │                                      ├─→ Session summary
  │     │                                      ├─→ AI analysis
  │     │                                      ├─→ Progress graphs
  │     │                                      │
  │     │                                      └─→ [Back to Dashboard]
  │     │
  │     └─→ View "Progress & Analytics"
  │           │
  │           └─→ Form score history, exercise breakdown
  │
END
```

---

## Implementation Priority

### Phase 1: Core UI Components (Week 7)
1. ExerciseCameraView.tsx (basic layout)
2. PreWorkoutSetup.tsx (camera preview)
3. FormScoreRing.tsx (reusable component)
4. LiveFeedbackPanel.tsx (message stream)

### Phase 2: Integration & Polish (Week 7-8)
5. PoseOverlay.tsx (canvas rendering)
6. PostWorkoutAnalysis.tsx (summary dashboard)
7. Dashboard integration (new entry point)
8. Mobile responsive layouts

### Phase 3: Enhancement (If Time Permits)
9. Voice commands
10. Session recording
11. Progress graphs
12. Share/export functionality

---

## Next Steps

1. **Review & Approve Mockups**: Ensure design aligns with your vision
2. **Create Figma/Design Files**: High-fidelity mockups for reference
3. **Set Up Component Structure**: Create placeholder components
4. **Integrate with MediaPipe**: Connect video feed to pose detection
5. **Implement State Management**: Set up data flow for real-time updates

---

**Document Status:** Ready for Implementation
**Design Review:** Pending Approval
**Next Review Date:** Before Week 7 Implementation

---

## Appendix: Color Palette Reference

```
PRIMARY PURPLE: hsl(262, 83%, 58%)  → #8B5CF6
FORM EXCELLENT:  hsl(142, 71%, 45%) → #10B981 (Green)
FORM GOOD:       hsl(45, 93%, 47%)  → #F59E0B (Yellow)
FORM POOR:       hsl(0, 84%, 60%)   → #EF4444 (Red)
BACKGROUND:      hsl(0, 0%, 100%)   → #FFFFFF (Light)
DARK BG:         hsl(222, 84%, 5%)  → #0F172A (Dark)
```

---

**END OF UI MOCKUPS DOCUMENT**
