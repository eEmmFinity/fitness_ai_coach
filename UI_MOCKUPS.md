# Visual UI Mockups - Fitness AI Coach
## Real-Time Exercise Recognition Feature

**Project:** Fitness AI Coach - Phase II Enhancement
**Designer:** Claude Code AI
**Date:** January 2025
**Version:** 1.0

---

## Table of Contents

1. [Live Workout Camera Page](#1-live-workout-camera-page)
2. [Post-Workout Analysis Dashboard](#2-post-workout-analysis-dashboard)
3. [Exercise Selection Screen](#3-exercise-selection-screen)
4. [Real-Time Feedback Overlay](#4-real-time-feedback-overlay)
5. [Settings & Configuration](#5-settings--configuration)
6. [Mobile Responsive Views](#6-mobile-responsive-views)
7. [AI Coach Chat Integration](#7-ai-coach-chat-integration)
8. [Progress Tracking Dashboard](#8-progress-tracking-dashboard)

---

## 1. Live Workout Camera Page

**Route:** `/workout-plan/live`
**Primary Use Case:** User performs exercises with real-time AI coaching

### Desktop View (1920x1080)

```
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Workout Plan          🏋️ LIVE WORKOUT MODE          [⚙️ Settings]  [❌ Exit]       │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                               │
│  ┌─────────────────────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │                                                 │  │  🎯 EXERCISE DETECTED              │ │
│  │                                                 │  │  ══════════════════════════════    │ │
│  │                                                 │  │                                    │ │
│  │           VIDEO FEED AREA                       │  │  🏋️ SQUAT                         │ │
│  │           1280 x 720                            │  │  Confidence: 96%                  │ │
│  │                                                 │  │                                    │ │
│  │   ┌──────────────────────────────────────┐     │  │  ─────────────────────────────    │ │
│  │   │                                      │     │  │                                    │ │
│  │   │  [Person performing squat with       │     │  │  📊 REPETITIONS                   │ │
│  │   │   MediaPipe skeleton overlay]        │     │  │  ══════════════════════════════    │ │
│  │   │                                      │     │  │                                    │ │
│  │   │  33 landmarks shown as connected     │     │  │       ┌───────────┐               │ │
│  │   │  dots and lines:                     │     │  │       │           │               │ │
│  │   │  - Green: Good form (80-100%)        │     │  │       │    24     │               │ │
│  │   │  - Yellow: Minor issues (60-79%)     │     │  │       │           │               │ │
│  │   │  - Red: Critical issues (<60%)       │     │  │       └───────────┘               │ │
│  │   │                                      │     │  │                                    │ │
│  │   │  Shoulder-Hip-Knee-Ankle alignment   │     │  │  Current Phase: ⬇️ Descending     │ │
│  │   │  shown with vertical guide line      │     │  │                                    │ │
│  │   │                                      │     │  │  ─────────────────────────────    │ │
│  │   └──────────────────────────────────────┘     │  │                                    │ │
│  │                                                 │  │  💪 FORM QUALITY                  │ │
│  │                                                 │  │  ══════════════════════════════    │ │
│  │  [● LIVE] 05:32                                 │  │                                    │ │
│  │                                                 │  │  ████████████████████░░░░░ 87%    │ │
│  │                                                 │  │                                    │ │
│  └─────────────────────────────────────────────────┘  │  Excellent  ━━  Good  ━━  Poor    │ │
│                                                        │                                    │ │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │ │
│  │  💬 AI COACH FEEDBACK                                                                 │  │ │
│  │  ═════════════════════════════════════════════════════════════════════════════════    │  │ │
│  │                                                                                       │  │ │
│  │  2 seconds ago                                                                        │  │ │
│  │  ✅ "Excellent depth! You're hitting parallel perfectly."                            │  │ │
│  │                                                                                       │  │ │
│  │  8 seconds ago                                                                        │  │ │
│  │  ⚠️  "Watch your knees - they're tracking forward slightly. Sit back into your       │  │ │
│  │      hips more. Imagine sitting in a chair behind you."                              │  │ │
│  │                                                                                       │  │ │
│  │  15 seconds ago                                                                       │  │ │
│  │  💪 "Great job! Core looks tight. Keep that chest up!"                               │  │ │
│  │                                                                                       │  │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘  │ │
│                                                                                            │ │
│  ┌─────────────────────────────────────────────┐  ┌─────────────────────────────────────┐ │ │
│  │  🔥 CALORIES BURNED                          │  │  ⏱️ SESSION TIME                    │ │ │
│  │  ═════════════════════════════════════       │  │  ═══════════════════════════════    │ │ │
│  │                                              │  │                                     │ │ │
│  │         78 kcal                              │  │         05:32                       │ │ │
│  │                                              │  │                                     │ │ │
│  │  +2.4 kcal/min                               │  │  Target: 30:00                      │ │ │
│  └─────────────────────────────────────────────┘  └─────────────────────────────────────┘ │ │
│                                                                                            │ │
│                                                        ─────────────────────────────────   │ │
│  ┌──────────────────────────────────────────────────────────────────────────────────────┐ │ │
│  │                              CONTROL PANEL                                            │ │ │
│  │  ═════════════════════════════════════════════════════════════════════════════════    │ │ │
│  │                                                                                       │ │ │
│  │   [⏸️  PAUSE WORKOUT]    [⏹️  STOP & ANALYZE]    [💬 ASK AI COACH]    [🎥 RECORD]    │ │ │
│  │                                                                                       │ │ │
│  └──────────────────────────────────────────────────────────────────────────────────────┘ │ │
│                                                                                            │ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Design Specifications:

**Color Palette:**
- **Primary Green (#10B981):** Good form, positive feedback
- **Warning Yellow (#F59E0B):** Minor form issues
- **Critical Red (#EF4444):** Dangerous form issues
- **Purple Gradient (#8B5CF6 → #6366F1):** AI coach branding
- **Background:** Dark mode (#0F172A) / Light mode (#FFFFFF)

**Typography:**
- **Rep Counter:** Inter Bold, 72px
- **Form Score:** Inter Semibold, 48px
- **Exercise Name:** Inter Bold, 32px
- **Feedback Messages:** Inter Regular, 16px
- **Metrics:** Inter Medium, 18px

**Layout Grid:**
- **Left Panel (Video):** 66.67% width
- **Right Panel (Metrics):** 33.33% width
- **Feedback Stream:** Full width, 160px height
- **Control Panel:** Full width, 80px height

**Skeleton Overlay Details:**

```
Pose Landmark Connections (MediaPipe 33 points):

     ⚫ 0 (nose)
      |
   ⚫-┴-⚫  (eyes)
      |
   ⚫-⚫-⚫  (ears, mouth)
      |
    ⚫-⚫   (shoulders 11, 12)
    |   |
    ⚫   ⚫  (elbows 13, 14)
    |   |
    ⚫   ⚫  (wrists 15, 16)
    |   |
  ⚫-⚫-⚫  (hips 23, 24)
    |   |
    ⚫   ⚫  (knees 25, 26)
    |   |
    ⚫   ⚫  (ankles 27, 28)
    |   |
    ⚫   ⚫  (feet 31, 32)

Line colors:
- Green: visibility > 0.8, form score > 80
- Yellow: visibility 0.6-0.8, form score 60-80
- Red: visibility < 0.6, form score < 60
- Dotted: landmark not visible
```

---

## 2. Post-Workout Analysis Dashboard

**Route:** `/workout-plan/analysis/[sessionId]`
**Primary Use Case:** Review completed workout session

```
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                     WORKOUT SESSION ANALYSIS                             │
│                                     Monday, July 15, 2025 • 3:45 PM                           │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  📊 OVERALL PERFORMANCE                                                                  │ │
│  │  ════════════════════════════════════════════════════════════════════════════════════    │ │
│  │                                                                                          │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │ │
│  │  │                  │  │                  │  │                  │  │                 │ │ │
│  │  │  💪 FORM SCORE   │  │  🔥 CALORIES     │  │  🏋️ TOTAL REPS  │  │  ⏱️ DURATION    │ │ │
│  │  │                  │  │                  │  │                  │  │                 │ │ │
│  │  │       87         │  │      245         │  │       127        │  │     32:14       │ │ │
│  │  │      /100        │  │      kcal        │  │      reps        │  │      min        │ │ │
│  │  │                  │  │                  │  │                  │  │                 │ │ │
│  │  │  ⬆️ +5% vs last  │  │  ⬆️ +12 kcal     │  │  ⬆️ +8 reps      │  │  ➡️ Similar     │ │ │
│  │  │     week         │  │     vs last week │  │     vs last week │  │    vs last week │ │ │
│  │  │                  │  │                  │  │                  │  │                 │ │ │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────────┘ │ │
│  │                                                                                          │ │
│  │  🎯 Overall Assessment: EXCELLENT WORKOUT! You're making great progress.                │ │
│  │                                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  🏋️ EXERCISE BREAKDOWN                                                                   │ │
│  │  ════════════════════════════════════════════════════════════════════════════════════    │ │
│  │                                                                                          │ │
│  │  ┌────────────────┬──────┬──────┬──────────┬──────────┬─────────────────────────────┐  │ │
│  │  │ Exercise       │ Sets │ Reps │ Avg Form │ Calories │ Primary Issue Detected      │  │ │
│  │  ├────────────────┼──────┼──────┼──────────┼──────────┼─────────────────────────────┤  │ │
│  │  │ 🦵 Squats      │  3   │  45  │ 92% 🟢   │  95 kcal │ ✅ None - Excellent form    │  │ │
│  │  │                │      │      │          │          │                             │  │ │
│  │  │ [▼ Expand]     │      │      │          │          │                             │  │ │
│  │  ├────────────────┼──────┼──────┼──────────┼──────────┼─────────────────────────────┤  │ │
│  │  │ 💪 Push-ups    │  3   │  30  │ 78% 🟡   │  68 kcal │ ⚠️  Hip sagging (last 10)   │  │ │
│  │  │                │      │      │          │          │                             │  │ │
│  │  │ [▼ Expand]     │      │      │          │          │  [📊 View Form Analysis]    │  │ │
│  │  ├────────────────┼──────┼──────┼──────────┼──────────┼─────────────────────────────┤  │ │
│  │  │ 🧘 Plank Hold  │  3   │ 180s │ 91% 🟢   │  42 kcal │ ✅ Great core stability     │  │ │
│  │  │                │      │      │          │          │                             │  │ │
│  │  │ [▼ Expand]     │      │      │          │          │                             │  │ │
│  │  ├────────────────┼──────┼──────┼──────────┼──────────┼─────────────────────────────┤  │ │
│  │  │ 💪 Bicep Curls │  3   │  40  │ 85% 🟢   │  40 kcal │ ⚠️  Elbow flare (8 reps)    │  │ │
│  │  │                │      │      │          │          │                             │  │ │
│  │  │ [▼ Expand]     │      │      │          │          │  [📊 View Form Analysis]    │  │ │
│  │  └────────────────┴──────┴──────┴──────────┴──────────┴─────────────────────────────┘  │ │
│  │                                                                                          │ │
│  │  Total Exercises: 4  •  Total Sets: 12  •  Average Rest: 62 seconds                     │ │
│  │                                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  🤖 AI COACH DETAILED ANALYSIS                                                           │ │
│  │  ════════════════════════════════════════════════════════════════════════════════════    │ │
│  │                                                                                          │ │
│  │  Great workout today! I analyzed your entire session and here's my comprehensive        │ │
│  │  assessment based on 127 repetitions and 32 minutes of exercise data:                   │ │
│  │                                                                                          │ │
│  │  ✅ STRENGTHS (What You Did Well)                                                        │ │
│  │  ─────────────────────────────────────────────────────────────                          │ │
│  │                                                                                          │ │
│  │  1. **Squat Technique (92% form score)**                                                │ │
│  │     • You maintained excellent depth throughout all 45 reps                             │ │
│  │     • Your knees stayed aligned with your toes in 43/45 reps (96% consistency)          │ │
│  │     • Hip hinge mechanics were spot-on - you're sitting back properly                   │ │
│  │     • Core engagement was strong (detected via spine alignment)                         │ │
│  │                                                                                          │ │
│  │  2. **Plank Hold Improvement (91% form score)**                                         │ │
│  │     • Hold time increased from 50 seconds to 60 seconds per set (+20% improvement!)     │ │
│  │     • Body alignment was nearly perfect - only 2° deviation in set 2                    │ │
│  │     • Hip position remained stable throughout entire duration                           │ │
│  │                                                                                          │ │
│  │  3. **Workout Consistency**                                                             │ │
│  │     • Completed full workout without skipping exercises                                 │ │
│  │     • Rest periods were appropriate (60-75 seconds average)                             │ │
│  │     • Energy levels remained high throughout session                                    │ │
│  │                                                                                          │ │
│  │  ⚠️  AREAS FOR IMPROVEMENT (Specific Issues with Data)                                   │ │
│  │  ─────────────────────────────────────────────────────────────────────────              │ │
│  │                                                                                          │ │
│  │  1. **Push-up Form Degradation (78% form score)**                                       │ │
│  │     • Reps 1-20: Excellent form (avg 86% score)                                         │ │
│  │     • Reps 21-30: Hip sagging detected (dropped to 64% score)                           │ │
│  │     • Issue: Core fatigue causing hip angle to increase by 12° on average               │ │
│  │     • Timeline: Form broke down in last 2 sets (sets 2-3)                               │ │
│  │                                                                                          │ │
│  │     📊 DETAILED BREAKDOWN:                                                               │ │
│  │     Set 1: 92% form (reps 1-10)  ✅                                                      │ │
│  │     Set 2: 78% form (reps 11-20) ⚠️  (hip drop started)                                  │ │
│  │     Set 3: 64% form (reps 21-30) 🔴 (significant hip sag)                                │ │
│  │                                                                                          │ │
│  │  2. **Bicep Curl Elbow Positioning (85% form score)**                                   │ │
│  │     • Your elbows flared out on 8 reps (reps 15, 16, 22, 23, 31, 32, 38, 39)            │ │
│  │     • Pattern: Elbow flare occurred when weight was at peak contraction                 │ │
│  │     • Angle deviation: 15° average elbow flare (should be <5°)                          │ │
│  │     • This reduces bicep isolation and recruits anterior deltoids                       │ │
│  │                                                                                          │ │
│  │  💡 ACTIONABLE RECOMMENDATIONS (Based on Your Data)                                      │ │
│  │  ─────────────────────────────────────────────────────────────────────────              │ │
│  │                                                                                          │ │
│  │  To Fix Push-up Hip Sagging:                                                            │ │
│  │  ─────────────────────────────                                                          │ │
│  │  1. **Add Core Strengthening Exercises:**                                               │ │
│  │     • Plank variations: Side planks (30s each side)                                     │ │
│  │     • Dead bugs: 3 sets of 10 reps                                                      │ │
│  │     • Hollow body holds: 3 sets of 20 seconds                                           │ │
│  │                                                                                          │ │
│  │  2. **Modify Last Set Strategy:**                                                       │ │
│  │     • Option A: Do last set on knees to maintain form quality                           │ │
│  │     • Option B: Reduce reps in last set (aim for 8 reps instead of 10)                  │ │
│  │     • Option C: Take longer rest before last set (90s instead of 60s)                   │ │
│  │                                                                                          │ │
│  │  3. **Form Cue to Remember:**                                                           │ │
│  │     • "Squeeze glutes, tuck pelvis, create straight line from head to heels"            │ │
│  │     • Engage core BEFORE descending into each push-up                                   │ │
│  │                                                                                          │ │
│  │  To Fix Bicep Curl Elbow Flare:                                                         │ │
│  │  ───────────────────────────────                                                        │ │
│  │  1. **Positional Cue:**                                                                 │ │
│  │     • Pin elbows to ribs - imagine holding a towel between elbow and torso              │ │
│  │     • Keep elbows slightly in front of shoulders (not directly to sides)                │ │
│  │                                                                                          │ │
│  │  2. **Reduce Weight if Necessary:**                                                     │ │
│  │     • Elbow flare often indicates weight is too heavy                                   │ │
│  │     • Try reducing by 5-10 lbs to maintain strict form                                  │ │
│  │     • Quality reps > quantity                                                           │ │
│  │                                                                                          │ │
│  │  3. **Add Supplementary Exercise:**                                                     │ │
│  │     • Face pulls: 3 sets of 15 reps (improves shoulder stability)                       │ │
│  │     • This will strengthen rear delts and improve overall shoulder mechanics            │ │
│  │                                                                                          │ │
│  │  📈 PROGRESS TREND ANALYSIS (vs. Previous Sessions)                                      │ │
│  │  ───────────────────────────────────────────────────────────────                        │ │
│  │                                                                                          │ │
│  │  Your overall form score has improved 5% compared to last week (82% → 87%).             │ │
│  │  This is excellent progress!                                                            │ │
│  │                                                                                          │ │
│  │  30-Day Trend:                                                                          │ │
│  │  • Week 1: 72% avg form score                                                           │ │
│  │  • Week 2: 77% avg form score (+5%)                                                     │ │
│  │  • Week 3: 82% avg form score (+5%)                                                     │ │
│  │  • Week 4: 87% avg form score (+5%) ⬆️                                                  │ │
│  │                                                                                          │ │
│  │  At this rate, you'll hit 90%+ form score (expert level) in 2-3 more workouts!          │ │
│  │                                                                                          │ │
│  │  🎯 ALIGNMENT WITH YOUR GOALS                                                            │ │
│  │  ─────────────────────────────────────                                                  │ │
│  │                                                                                          │ │
│  │  Your goal: Muscle Building                                                             │ │
│  │  Current trajectory: ON TRACK ✅                                                         │ │
│  │                                                                                          │ │
│  │  • Progressive overload: +8 reps vs last week (good muscle stimulus)                    │ │
│  │  • Form quality: 87% (ensures muscle activation, reduces injury risk)                   │ │
│  │  • Volume: 12 total sets (within optimal range of 10-20 sets/week per muscle group)     │ │
│  │                                                                                          │ │
│  │  Recommendation: Continue current program. Consider adding 5 lbs to squats next week    │ │
│  │  since your form is consistently excellent (92%).                                       │ │
│  │                                                                                          │ │
│  │  ⏭️ NEXT WORKOUT SUGGESTIONS                                                             │ │
│  │  ────────────────────────────────                                                       │ │
│  │                                                                                          │ │
│  │  1. Keep current squat protocol (it's working perfectly!)                               │ │
│  │  2. Add core exercises BEFORE push-ups (pre-fatigue strategy won't help here)           │ │
│  │  3. Reduce bicep curl weight by 5 lbs to nail form                                      │ │
│  │  4. Add face pulls (2 sets of 15) for shoulder health                                   │ │
│  │                                                                                          │ │
│  │  Would you like me to generate a modified workout plan incorporating these changes?     │ │
│  │  [✅ Yes, Generate Modified Plan]  [💬 Ask Follow-up Question]                          │ │
│  │                                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  📈 FORM SCORE TREND (Last 30 Days)                                                      │ │
│  │  ════════════════════════════════════════════════════════════════════════════════════    │ │
│  │                                                                                          │ │
│  │   100% ┤                                                                                 │ │
│  │        │                                                                                 │ │
│  │    95% ┤                                                                                 │ │
│  │        │                                                                                 │ │
│  │    90% ┤                                                             ●                   │ │
│  │        │                                                         ╱                       │ │
│  │    85% ┤                                             ●       ●                           │ │
│  │        │                                         ╱       ╱                               │ │
│  │    80% ┤                         ●           ●                                           │ │
│  │        │                     ╱           ╱                                               │ │
│  │    75% ┤         ●       ●                                                               │ │
│  │        │     ╱       ╱                                                                   │ │
│  │    70% ┤ ●                                                                               │ │
│  │        │                                                                                 │ │
│  │    65% ┤                                                                                 │ │
│  │        │                                                                                 │ │
│  │    60% ┼─────────────────────────────────────────────────────────────────────           │ │
│  │        Jun    Jun    Jun    Jul    Jul    Jul    Jul    Jul    Jul    Jul               │ │
│  │        15    18     22     29     2      6      9      12     15     18                 │ │
│  │                                                                                          │ │
│  │   🟢 Excellent (80-100%)    🟡 Good (60-79%)    🔴 Needs Work (<60%)                     │ │
│  │                                                                                          │ │
│  │   Trend: +15 points improvement over 30 days (72% → 87%)                                │ │
│  │   Projection: Will reach 90%+ in next 2-3 workouts at current rate                      │ │
│  │                                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  🔥 CALORIE BURN BREAKDOWN                                                               │ │
│  │  ════════════════════════════════════════════════════════════════════════════════════    │ │
│  │                                                                                          │ │
│  │  Total Session: 245 kcal                                                                │ │
│  │  Rate: 7.6 kcal/min                                                                     │ │
│  │                                                                                          │ │
│  │  By Exercise:                                                                           │ │
│  │  ┌─────────────────────────────────────────────────────────────────────┐                │ │
│  │  │ 🦵 Squats       ████████████████████ 95 kcal (39%)                  │                │ │
│  │  │ 💪 Push-ups     ██████████████ 68 kcal (28%)                         │                │ │
│  │  │ 🧘 Plank        ████████ 42 kcal (17%)                               │                │ │
│  │  │ 💪 Bicep Curls  ████████ 40 kcal (16%)                               │                │ │
│  │  └─────────────────────────────────────────────────────────────────────┘                │ │
│  │                                                                                          │ │
│  │  Compared to last week: +12 kcal (+5% increase)                                         │ │
│  │                                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                    ACTIONS                                               │ │
│  │  ════════════════════════════════════════════════════════════════════════════════════    │ │
│  │                                                                                          │ │
│  │   [💬 Chat with AI Coach]  [📊 View All Sessions]  [🏠 Return to Dashboard]             │ │
│  │                                                                                          │ │
│  │   [📤 Share Results]  [📥 Export to PDF]  [📝 Add Personal Notes]  [🔄 Start New]       │ │
│  │                                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                               │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Exercise Selection Screen

**Route:** `/workout-plan/live/select-exercise`
**Primary Use Case:** Choose which exercise to perform

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    SELECT EXERCISE TO TRACK                           │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Choose an exercise from your workout plan or select from library:            │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  📋 FROM YOUR WORKOUT PLAN                                                │ │
│  │  ══════════════════════════════════════════════════════════════════════   │ │
│  │                                                                           │ │
│  │  Monday - Upper Body                                                     │ │
│  │                                                                           │ │
│  │  ┌─────────────────────────────────────────┐                             │ │
│  │  │  🦵 Barbell Squats                      │  [▶️ START TRACKING]         │ │
│  │  │  4 sets × 8-10 reps                     │                             │ │
│  │  │  ✅ Supported by AI recognition         │                             │ │
│  │  └─────────────────────────────────────────┘                             │ │
│  │                                                                           │ │
│  │  ┌─────────────────────────────────────────┐                             │ │
│  │  │  💪 Push-ups                            │  [▶️ START TRACKING]         │ │
│  │  │  3 sets × 12-15 reps                    │                             │ │
│  │  │  ✅ Supported by AI recognition         │                             │ │
│  │  └─────────────────────────────────────────┘                             │ │
│  │                                                                           │ │
│  │  ┌─────────────────────────────────────────┐                             │ │
│  │  │  💪 Dumbbell Rows                       │  [⚠️ Manual Tracking Only]   │ │
│  │  │  4 sets × 10-12 reps                    │                             │ │
│  │  │  ⚠️  Not yet supported by AI             │                             │ │
│  │  └─────────────────────────────────────────┘                             │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  📚 EXERCISE LIBRARY (AI-Supported)                                       │ │
│  │  ══════════════════════════════════════════════════════════════════════   │ │
│  │                                                                           │ │
│  │  [🔍 Search exercises...]                                   [All ▼]       │ │
│  │                                                                           │ │
│  │  ┌───────────────┬───────────────┬───────────────┬───────────────┐       │ │
│  │  │               │               │               │               │       │ │
│  │  │  🦵 SQUATS    │  💪 PUSH-UPS  │  🧘 PLANKS    │  💪 BICEP     │       │ │
│  │  │               │               │               │    CURLS      │       │ │
│  │  │  Difficulty:  │  Difficulty:  │  Difficulty:  │  Difficulty:  │       │ │
│  │  │  🟢 Beginner  │  🟡 Inter.    │  🟢 Beginner  │  🟢 Beginner  │       │ │
│  │  │               │               │               │               │       │ │
│  │  │  Targets:     │  Targets:     │  Targets:     │  Targets:     │       │ │
│  │  │  Legs, Glutes │  Chest, Tri   │  Core         │  Biceps       │       │ │
│  │  │               │               │               │               │       │ │
│  │  │  [▶️ START]   │  [▶️ START]   │  [▶️ START]   │  [▶️ START]   │       │ │
│  │  │               │               │               │               │       │ │
│  │  └───────────────┴───────────────┴───────────────┴───────────────┘       │ │
│  │                                                                           │ │
│  │  ┌───────────────┬───────────────┬───────────────┬───────────────┐       │ │
│  │  │               │               │               │               │       │ │
│  │  │  🦵 LUNGES    │  🦵 JUMP SQ.  │  💪 BURPEES   │  💪 SHOULDER  │       │ │
│  │  │               │               │               │    PRESS      │       │ │
│  │  │  Difficulty:  │  Difficulty:  │  Difficulty:  │  Difficulty:  │       │ │
│  │  │  🟡 Inter.    │  🔴 Advanced  │  🔴 Advanced  │  🟡 Inter.    │       │ │
│  │  │               │               │               │               │       │ │
│  │  │  Targets:     │  Targets:     │  Targets:     │  Targets:     │       │ │
│  │  │  Legs, Glutes │  Legs, Power  │  Full Body    │  Shoulders    │       │ │
│  │  │               │               │               │               │       │ │
│  │  │  [▶️ START]   │  [▶️ START]   │  [▶️ START]   │  [🔒 LOCKED]  │       │ │
│  │  │               │               │  (COMING SOON)│               │       │ │
│  │  └───────────────┴───────────────┴───────────────┴───────────────┘       │ │
│  │                                                                           │ │
│  │  7 exercises available  •  3 more coming soon  •  [➕ Request Exercise]   │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  ℹ️  TIPS FOR BEST RESULTS                                                │ │
│  │  ══════════════════════════════════════════════════════════════════════   │ │
│  │                                                                           │ │
│  │  • Position camera 6-8 feet away, at hip height                          │ │
│  │  • Ensure good lighting (natural light works best)                       │ │
│  │  • Wear fitted clothing for better body tracking                         │ │
│  │  • Full body should be visible in frame                                  │ │
│  │  • Clear background without clutter                                      │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Real-Time Feedback Overlay

**Overlay on Live Camera Feed**
**Appears when form issue is detected**

```
┌─────────────────────────────────────────────────────────┐
│  VIDEO FEED WITH POSE OVERLAY                           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │     [Person performing squat]                     │  │
│  │                                                   │  │
│  │     ⚫ ← Nose                                      │  │
│  │      |                                            │  │
│  │    ⚫-┴-⚫ ← Shoulders                              │  │
│  │    |   |                                          │  │
│  │    |   |  ┌────────────────────────────────────┐ │  │
│  │  ⚫ | ⚫ |  │ ⚠️  FORM ALERT                      │ │  │
│  │    | | |  │ ═══════════════════════════════     │ │  │
│  │  🔴|🔴|  │                                      │ │  │
│  │    | | |  │  Knees tracking forward!            │ │  │
│  │    ⚫ ⚫ |  │                                      │ │  │
│  │    | | |  │  💡 CORRECTION:                     │ │  │
│  │    ⚫ ⚫    │  Sit back into your hips more.      │ │  │
│  │           │  Push knees out slightly.           │ │  │
│  │           │                                      │ │  │
│  │           │  [Got it ✓]  [Ask AI for help 💬]   │ │  │
│  │           └────────────────────────────────────┘ │  │
│  │                                                   │  │
│  │  Red highlighting on knees indicates issue       │  │
│  │  Yellow vertical line shows ideal alignment      │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ANGLE INDICATOR (Optional visualization)         │  │
│  │                                                   │  │
│  │  Current knee angle: 165° ⚠️                      │  │
│  │  Target range: 135-145°                           │  │
│  │                                                   │  │
│  │  ┌────────────────────────────────────┐           │  │
│  │  │ │■■■■■■■■■■■■■■■■■■░░░░░│ Too far   │           │  │
│  │  └────────────────────────────────────┘           │  │
│  │    Too deep    Perfect     Current                │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Settings & Configuration

**Route:** `/workout-plan/live/settings`
**Accessible from gear icon in live mode**

```
┌───────────────────────────────────────────────────────────────────┐
│  ← Back to Live Mode              WORKOUT SETTINGS                │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🎥 CAMERA SETTINGS                                         │   │
│  │  ════════════════════════════════════════════════════════   │   │
│  │                                                            │   │
│  │  Camera Source:  [Built-in Camera ▼]                       │   │
│  │                  └─ Front Camera                           │   │
│  │                  └─ Back Camera (if available)             │   │
│  │                  └─ External Webcam                        │   │
│  │                                                            │   │
│  │  Resolution:     [● 640×480 (Fast)   ○ 1280×720 (HD)]      │   │
│  │                  Recommended: 640×480 for best performance │   │
│  │                                                            │   │
│  │  Frame Rate:     [Auto ▼]                                  │   │
│  │                  Current: 24 FPS                           │   │
│  │                                                            │   │
│  │  Mirror Video:   [● On   ○ Off]                            │   │
│  │                  (Flip horizontally for front camera)      │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🧠 AI DETECTION SETTINGS                                   │   │
│  │  ════════════════════════════════════════════════════════   │   │
│  │                                                            │   │
│  │  Model Complexity: [● Medium (Recommended)                 │   │
│  │                     ○ Light (Faster, less accurate)        │   │
│  │                     ○ Heavy (Slower, more accurate)]       │   │
│  │                                                            │   │
│  │  Detection Confidence: ████████████░░░░ 70%                │   │
│  │                        Lower = More sensitive              │   │
│  │                        Higher = More accurate              │   │
│  │                                                            │   │
│  │  Form Alert Sensitivity:                                   │   │
│  │    Critical Issues:  [● Always alert                       │   │
│  │                       ○ After 3 occurrences                │   │
│  │                       ○ Never]                             │   │
│  │                                                            │   │
│  │    Minor Issues:     [○ Always alert                       │   │
│  │                       ● After 3 occurrences                │   │
│  │                       ○ Never]                             │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  💬 AI COACH BEHAVIOR                                       │   │
│  │  ════════════════════════════════════════════════════════   │   │
│  │                                                            │   │
│  │  Feedback Frequency:                                       │   │
│  │    [● Real-time (Every issue detected)                     │   │
│  │     ○ Moderate (Every 5 reps or major issue)               │   │
│  │     ○ Summary only (End of set)]                           │   │
│  │                                                            │   │
│  │  Coaching Tone:                                            │   │
│  │    [● Encouraging & Supportive                             │   │
│  │     ○ Direct & Technical                                   │   │
│  │     ○ Minimal (Data only)]                                 │   │
│  │                                                            │   │
│  │  Voice Feedback: [○ On   ● Off]                            │   │
│  │                  (Text-to-speech for hands-free)           │   │
│  │                  🔒 Premium feature - Coming soon           │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🎨 VISUAL OVERLAY SETTINGS                                 │   │
│  │  ════════════════════════════════════════════════════════   │   │
│  │                                                            │   │
│  │  Show Skeleton:   [● On   ○ Off]                           │   │
│  │  Skeleton Style:  [● Colorful (Form-based)                 │   │
│  │                    ○ Monochrome (White lines)              │   │
│  │                    ○ Minimal (Dots only)]                  │   │
│  │                                                            │   │
│  │  Show Angles:     [○ On   ● Off]                           │   │
│  │                   (Display joint angles on screen)         │   │
│  │                                                            │   │
│  │  Guide Lines:     [● On   ○ Off]                           │   │
│  │                   (Alignment helpers)                      │   │
│  │                                                            │   │
│  │  Background Blur: [○ On   ● Off]                           │   │
│  │                   (Privacy mode - blur background)         │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🔊 AUDIO & NOTIFICATIONS                                   │   │
│  │  ════════════════════════════════════════════════════════   │   │
│  │                                                            │   │
│  │  Rep Counter Sound:  [● On   ○ Off]                        │   │
│  │                      (Beep when rep is counted)            │   │
│  │                                                            │   │
│  │  Form Alert Sound:   [● On   ○ Off]                        │   │
│  │                      (Chime for form corrections)          │   │
│  │                                                            │   │
│  │  Workout Complete:   [● On   ○ Off]                        │   │
│  │                      (Celebration sound at end)            │   │
│  │                                                            │   │
│  │  Volume:  ██████████░░░░░░░░░░ 50%                         │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🔒 PRIVACY SETTINGS                                        │   │
│  │  ════════════════════════════════════════════════════════   │   │
│  │                                                            │   │
│  │  Store Video:        [○ On   ● Off]                        │   │
│  │                      (Save video of workout sessions)      │   │
│  │                      ⚠️  Video stored locally only          │   │
│  │                                                            │   │
│  │  Store Landmarks:    [● On   ○ Off]                        │   │
│  │                      (Save pose data for analysis)         │   │
│  │                      ✅ Minimal data, anonymized            │   │
│  │                                                            │   │
│  │  Upload to Cloud:    [○ On   ● Off]                        │   │
│  │                      (Backup workout data to server)       │   │
│  │                      🔒 Encrypted connection                │   │
│  │                                                            │   │
│  │  Data Retention:     [Last 30 days ▼]                      │   │
│  │                      Auto-delete older sessions            │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │   [💾 Save Settings]    [🔄 Reset to Defaults]             │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 6. Mobile Responsive Views

### Mobile Portrait (375x812 - iPhone X)

**Live Workout Mode:**

```
┌────────────────────────────┐
│ ← Live Workout    ⚙️  ❌   │
├────────────────────────────┤
│                            │
│  ┌────────────────────────┐│
│  │                        ││
│  │   VIDEO FEED           ││
│  │   (Full width)         ││
│  │   375 x 500            ││
│  │                        ││
│  │   [Pose skeleton       ││
│  │    overlay]            ││
│  │                        ││
│  │                        ││
│  │  ● LIVE   02:15        ││
│  │                        ││
│  └────────────────────────┘│
│                            │
│  ┌────────────────────────┐│
│  │ 🏋️ SQUAT    Reps: 12   ││
│  ├────────────────────────┤│
│  │ Form: ████████░░ 85%   ││
│  ├────────────────────────┤│
│  │ 🔥 35 kcal  ⏱️ 02:15   ││
│  └────────────────────────┘│
│                            │
│  ┌────────────────────────┐│
│  │ 💬 AI FEEDBACK          │
│  │ ════════════════════   │
│  │ ✅ "Good depth!"       │
│  │ ⚠️  "Knees forward"     │
│  └────────────────────────┘│
│                            │
│  [⏸ Pause] [⏹ Stop] [💬]  │
│                            │
└────────────────────────────┘
```

**Post-Workout Analysis (Mobile):**

```
┌────────────────────────────┐
│ ← Analysis    📤 Share     │
├────────────────────────────┤
│ Workout Analysis           │
│ Mon, Jul 15 • 3:45 PM      │
├────────────────────────────┤
│                            │
│ ┌──────────┬──────────┐    │
│ │ Form 87% │ 245 kcal │    │
│ │ ⬆️ +5%   │ 🔥       │    │
│ ├──────────┼──────────┤    │
│ │ 127 reps │ 32:14    │    │
│ │ 💪       │ ⏱️       │    │
│ └──────────┴──────────┘    │
│                            │
│ ┌────────────────────────┐ │
│ │ 🏋️ EXERCISES            │ │
│ │ ════════════════════   │ │
│ │                        │ │
│ │ Squats                 │ │
│ │ 45 reps • 92% 🟢       │ │
│ │ [▼]                    │ │
│ ├────────────────────────┤ │
│ │ Push-ups               │ │
│ │ 30 reps • 78% 🟡       │ │
│ │ Hip sagging ⚠️          │ │
│ │ [▼]                    │ │
│ ├────────────────────────┤ │
│ │ Plank                  │ │
│ │ 180s • 91% 🟢          │ │
│ │ [▼]                    │ │
│ └────────────────────────┘ │
│                            │
│ ┌────────────────────────┐ │
│ │ 🤖 AI COACH ANALYSIS    │ │
│ │ ════════════════════   │ │
│ │                        │ │
│ │ Great workout! Here's  │ │
│ │ my analysis:           │ │
│ │                        │ │
│ │ ✅ Excellent squat     │ │
│ │    form (92%)          │ │
│ │                        │ │
│ │ ⚠️  Push-up form       │ │
│ │    dropped in last set │ │
│ │    (hip sagging)       │ │
│ │                        │ │
│ │ 💡 Add core exercises  │ │
│ │    to improve          │ │
│ │                        │ │
│ │ [Read Full Analysis]   │ │
│ └────────────────────────┘ │
│                            │
│ [💬 Chat] [🏠 Home]        │
│                            │
└────────────────────────────┘
```

### Mobile Landscape (812x375 - iPhone X Rotated)

**Optimized for Workout:**

```
┌──────────────────────────────────────────────────────────────┐
│ ←  Live Mode               🏋️ SQUAT              ⚙️  ❌      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────┐  ┌────────────────────────┐   │
│  │                          │  │  REPS    FORM          │   │
│  │   VIDEO FEED             │  │                        │   │
│  │   540 x 300              │  │    18     ████░ 87%    │   │
│  │                          │  │                        │   │
│  │   [Pose overlay]         │  │  🔥 45 kcal  ⏱️ 03:22  │   │
│  │                          │  │                        │   │
│  │  ● LIVE   03:22          │  │  ✅ "Great depth!"     │   │
│  │                          │  │  ⚠️  "Knees forward"    │   │
│  │                          │  │                        │   │
│  └──────────────────────────┘  │  [⏸] [⏹] [💬]         │   │
│                                └────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. AI Coach Chat Integration

**Enhanced AI Coach with Visual Context**

```
┌───────────────────────────────────────────────────────────────────┐
│  ← Back                      AI COACH CHAT                        │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🤖 Your AI coach now has access to your workout data!            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  CONVERSATION                                              │   │
│  │  ══════════════════════════════════════════════════════     │   │
│  │                                                            │   │
│  │  🤖 AI Coach                                3:45 PM        │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ Hello! I just reviewed your last workout session.    │ │   │
│  │  │ Great job today! I noticed some areas we can work on.│ │   │
│  │  │                                                      │ │   │
│  │  │ Would you like me to analyze specific exercises or  │ │   │
│  │  │ give you an overall assessment?                     │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │                                                            │   │
│  │                                        👤 You   3:46 PM    │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ How was my push-up form?                             │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │                                                            │   │
│  │  🤖 AI Coach                                3:46 PM        │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ Great question! Let me review your push-up data:     │ │   │
│  │  │                                                      │ │   │
│  │  │ 📊 PUSH-UP ANALYSIS (30 reps total):                │ │   │
│  │  │                                                      │ │   │
│  │  │ ✅ Reps 1-20: Excellent form (avg 86% score)        │ │   │
│  │  │    • Perfect body alignment                          │ │   │
│  │  │    • Good elbow position                             │ │   │
│  │  │    • Controlled tempo                                │ │   │
│  │  │                                                      │ │   │
│  │  │ ⚠️  Reps 21-30: Form degradation (avg 64% score)     │ │   │
│  │  │    • Hip sagging detected (12° drop)                 │ │   │
│  │  │    • Core fatigue visible                            │ │   │
│  │  │    • Reduced depth in last 3 reps                    │ │   │
│  │  │                                                      │ │   │
│  │  │ 💡 SPECIFIC FEEDBACK:                                │ │   │
│  │  │                                                      │ │   │
│  │  │ Your push-up form started strong but broke down in   │ │   │
│  │  │ the last set. This is common - it's a core strength  │ │   │
│  │  │ issue, not an upper body issue.                      │ │   │
│  │  │                                                      │ │   │
│  │  │ RECOMMENDATION:                                      │ │   │
│  │  │ 1. Add planks before push-ups to pre-activate core   │ │   │
│  │  │ 2. Do last set on knees to maintain quality          │ │   │
│  │  │ 3. Rest 90s instead of 60s before final set          │ │   │
│  │  │                                                      │ │   │
│  │  │ Would you like me to modify your workout plan to     │ │   │
│  │  │ include core strengthening exercises?                │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │                                        👤 You   3:47 PM    │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ Yes, please suggest core exercises                   │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  │                                                            │   │
│  │  🤖 AI Coach                                3:47 PM        │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ Perfect! Based on your current plank ability (60s    │ │   │
│  │  │ hold with 91% form), here are 3 exercises to add:    │ │   │
│  │  │                                                      │ │   │
│  │  │ 1. SIDE PLANKS                                       │ │   │
│  │  │    • 3 sets × 30 seconds each side                   │ │   │
│  │  │    • Do BEFORE push-ups                              │ │   │
│  │  │    • Targets obliques for better hip stability       │ │   │
│  │  │                                                      │ │   │
│  │  │ 2. DEAD BUGS                                         │ │   │
│  │  │    • 3 sets × 10 reps                                │ │   │
│  │  │    • Slow and controlled movement                    │ │   │
│  │  │    • Improves anti-extension core strength           │ │   │
│  │  │                                                      │ │   │
│  │  │ 3. HOLLOW BODY HOLDS                                 │ │   │
│  │  │    • 3 sets × 20 seconds                             │ │   │
│  │  │    • Advanced exercise - start with shorter holds    │ │   │
│  │  │    • Directly addresses push-up hip sag issue        │ │   │
│  │  │                                                      │ │   │
│  │  │ I can add these to your workout plan for Monday.     │ │   │
│  │  │ Should I create the updated plan?                    │ │   │
│  │  │                                                      │ │   │
│  │  │ [✅ Yes, Update Plan]  [📋 Show Me How First]        │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  💬 QUICK QUESTIONS                                         │   │
│  │  ════════════════════════════════════════════════════════   │   │
│  │                                                            │   │
│  │  [How can I improve my squat depth?]                       │   │
│  │  [What's causing my elbow flare in curls?]                 │   │
│  │  [Should I increase weight or reps next week?]             │   │
│  │  [Am I on track for my muscle building goal?]              │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  [Type your message...]                          [Send 📤] │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                   │
│  💡 Tip: I can now see your workout performance data including   │
│     rep counts, form scores, and specific issues. Ask me          │
│     detailed questions about your technique!                      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 8. Progress Tracking Dashboard

**Route:** `/dashboard` (Enhanced with CV data)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  FITNESS DASHBOARD                                      [Profile 👤] [⚙️]      │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Welcome back, John! 🎉                                                       │
│  You're on a 7-day workout streak! Keep it up!                                │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  📊 THIS WEEK'S PERFORMANCE                                               │ │
│  │  ═════════════════════════════════════════════════════════════════════    │ │
│  │                                                                           │ │
│  │  ┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐ │ │
│  │  │  Workouts   │ Total Reps  │ Avg Form    │  Calories   │   Time      │ │ │
│  │  │             │             │   Score     │   Burned    │   Active    │ │ │
│  │  ├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤ │ │
│  │  │             │             │             │             │             │ │ │
│  │  │      5      │     487     │  ████░ 85%  │  1,127 kcal │  2h 34m     │ │ │
│  │  │  workouts   │    reps     │             │             │             │ │ │
│  │  │             │             │             │             │             │ │ │
│  │  │  ⬆️ +1      │  ⬆️ +52     │  ⬆️ +3%     │  ⬆️ +89     │  ➡️ Same    │ │ │
│  │  │             │             │             │             │             │ │ │
│  │  └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘ │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  📈 FORM SCORE PROGRESS (AI-Tracked)                                      │ │
│  │  ═════════════════════════════════════════════════════════════════════    │ │
│  │                                                                           │ │
│  │   100% ┤                                                                  │ │
│  │        │                                                   ●              │ │
│  │    90% ┤                                       ●       ●                  │ │
│  │        │                           ●       ●                              │ │
│  │    80% ┤               ●       ●                                          │ │
│  │        │           ╱       ╱                                              │ │
│  │    70% ┤       ●                                                          │ │
│  │        │   ╱                                                              │ │
│  │    60% ┤ ●                                                                │ │
│  │        │                                                                  │ │
│  │        └──────────────────────────────────────────────────────            │ │
│  │         Mon   Tue   Wed   Thu   Fri   Sat   Sun                          │ │
│  │         7/8   7/9   7/10  7/11  7/12  7/13  7/14                          │ │
│  │                                                                           │ │
│  │  🎯 Target: 90% by end of month (13 days remaining)                       │ │
│  │  📊 Current trend: +3% per week → You'll reach goal in 2 weeks! ✅        │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │  🏆 ACHIEVEMENTS                     │  │  🎯 ACTIVE GOALS                │ │
│  │  ═════════════════════════════════   │  │  ═══════════════════════════    │ │
│  │                                      │  │                                 │ │
│  │  ✅ 7-Day Streak                    │  │  💪 Muscle Building             │ │
│  │  ✅ 100 Squats (Lifetime)           │  │  Progress: ████████░░ 78%       │ │
│  │  ✅ Form Master (85%+ avg)          │  │  Target: Gain 5 lbs muscle      │ │
│  │  🔒 500 Reps (Lifetime)             │  │  Est. completion: 3 weeks       │ │
│  │     Progress: 487/500 (97%)         │  │                                 │ │
│  │                                      │  │  🦵 Squat 200 lbs               │ │
│  │  [View All Achievements]            │  │  Progress: ██████░░░░ 60%       │ │
│  │                                      │  │  Current: 120 lbs               │ │
│  │                                      │  │  Target: 200 lbs                │ │
│  │                                      │  │                                 │ │
│  │                                      │  │  [Manage Goals]                 │ │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  💡 AI COACH INSIGHTS                                                     │ │
│  │  ═════════════════════════════════════════════════════════════════════    │ │
│  │                                                                           │ │
│  │  Based on your last 7 workouts, here are my recommendations:             │ │
│  │                                                                           │ │
│  │  ✅ STRENGTHS:                                                            │ │
│  │     • Squat form is consistently excellent (90%+ average)                 │ │
│  │     • Workout adherence is perfect (7/7 days)                             │ │
│  │     • Progressive overload is working (+52 total reps this week)          │ │
│  │                                                                           │ │
│  │  ⚠️  WATCH OUT FOR:                                                       │ │
│  │     • Push-up form degrading in last sets (fatigue pattern detected)      │ │
│  │     • Bicep curl elbow flare on heavy sets (reduce weight 5-10 lbs)       │ │
│  │                                                                           │ │
│  │  💡 THIS WEEK'S FOCUS:                                                    │ │
│  │     Add core exercises before push-ups to prevent hip sagging             │ │
│  │     Consider deload week next week (7 consecutive days is demanding)      │ │
│  │                                                                           │ │
│  │  [💬 Chat with Coach]  [📋 Update Workout Plan]                          │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  📋 RECENT WORKOUTS                                                       │ │
│  │  ═════════════════════════════════════════════════════════════════════    │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ Mon, Jul 15 • 3:45 PM                      Form: 87%  •  245 kcal  │  │ │
│  │  ├────────────────────────────────────────────────────────────────────┤  │ │
│  │  │ Upper Body • 32 min • 127 reps                                     │  │ │
│  │  │ Squats, Push-ups, Plank, Bicep Curls                               │  │ │
│  │  │                                                                    │  │ │
│  │  │ [📊 View Analysis]  [🔄 Repeat Workout]                            │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                           │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │  │ Sun, Jul 14 • 10:30 AM                     Form: 82%  •  233 kcal  │  │ │
│  │  ├────────────────────────────────────────────────────────────────────┤  │ │
│  │  │ Lower Body • 28 min • 119 reps                                     │  │ │
│  │  │ Squats, Lunges, Plank                                              │  │ │
│  │  │                                                                    │  │ │
│  │  │ [📊 View Analysis]  [🔄 Repeat Workout]                            │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                           │ │
│  │  [View All Workouts]                                                     │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                              QUICK ACTIONS                                │ │
│  │  ═════════════════════════════════════════════════════════════════════    │ │
│  │                                                                           │ │
│  │   [🎥 Start Live Workout]  [📋 View Workout Plan]  [💬 Chat with Coach]  │ │
│  │                                                                           │ │
│  │   [🧮 Fitness Calculators]  [📊 Progress Reports]  [⚙️ Settings]          │ │
│  │                                                                           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Design System Summary

### Color Scheme

**Light Mode:**
- Background: `#FFFFFF`
- Secondary BG: `#F8FAFC`
- Text Primary: `#0F172A`
- Text Secondary: `#64748B`
- Borders: `#E2E8F0`

**Dark Mode:**
- Background: `#0F172A`
- Secondary BG: `#1E293B`
- Text Primary: `#F1F5F9`
- Text Secondary: `#94A3B8`
- Borders: `#334155`

**Accent Colors:**
- Primary (Purple): `#8B5CF6`
- Success (Green): `#10B981`
- Warning (Yellow): `#F59E0B`
- Error (Red): `#EF4444`
- Info (Blue): `#3B82F6`

### Typography

**Font Family:** Inter (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI")

**Font Sizes:**
- Heading 1: 48px / 3rem
- Heading 2: 32px / 2rem
- Heading 3: 24px / 1.5rem
- Body Large: 18px / 1.125rem
- Body: 16px / 1rem
- Small: 14px / 0.875rem
- Tiny: 12px / 0.75rem

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing System

Using 4px base unit (rem scale):
- XS: 4px (0.25rem)
- S: 8px (0.5rem)
- M: 16px (1rem)
- L: 24px (1.5rem)
- XL: 32px (2rem)
- 2XL: 48px (3rem)
- 3XL: 64px (4rem)

### Border Radius

- Small: 4px
- Medium: 8px
- Large: 12px
- XLarge: 16px
- Full: 9999px (pill shape)

### Shadows

**Light Mode:**
- Small: `0 1px 2px rgba(0, 0, 0, 0.05)`
- Medium: `0 4px 6px rgba(0, 0, 0, 0.1)`
- Large: `0 10px 15px rgba(0, 0, 0, 0.1)`

**Dark Mode:**
- Small: `0 1px 2px rgba(0, 0, 0, 0.3)`
- Medium: `0 4px 6px rgba(0, 0, 0, 0.4)`
- Large: `0 10px 15px rgba(0, 0, 0, 0.5)`

---

## Component States

### Button States
- **Default:** Primary color, medium shadow
- **Hover:** Darken 10%, larger shadow
- **Active:** Darken 15%, smaller shadow
- **Disabled:** 50% opacity, no shadow, no hover

### Form Score Gauge
- **Excellent (80-100%):** Green `#10B981`
- **Good (60-79%):** Yellow `#F59E0B`
- **Poor (0-59%):** Red `#EF4444`

### Skeleton Overlay
- **Good Form:** Green lines `#10B981`, 3px width
- **Minor Issues:** Yellow lines `#F59E0B`, 3px width
- **Critical Issues:** Red lines `#EF4444`, 4px width (thicker for visibility)
- **Landmarks:** White circles, 8px diameter

---

## Accessibility

- **WCAG AA Compliant:** All text has contrast ratio >4.5:1
- **Keyboard Navigation:** Tab order follows visual hierarchy
- **Screen Reader Support:** ARIA labels on all interactive elements
- **Focus Indicators:** 2px outline on focus
- **Alt Text:** All icons have descriptive labels

---

**END OF UI MOCKUPS DOCUMENT**

Version 1.0 • January 2025 • Claude Code AI