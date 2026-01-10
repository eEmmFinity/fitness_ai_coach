# Quick Start Guide: Implementing CV Feature
## Week 1 Action Items - Start TODAY

**Goal:** Validate technical feasibility within 7 days

---

## Day 1: Environment Setup (2 hours)

### Install Dependencies

```bash
cd /Users/emamulhaqueemon/Downloads/firness-AI-APP/fitness-ai-coach

# Install MediaPipe and related packages
npm install @mediapipe/pose @mediapipe/camera_utils @mediapipe/drawing_utils
npm install --save-dev @types/node

# Verify installation
npm list @mediapipe/pose
```

### Create Directory Structure

```bash
# Create vision library directories
mkdir -p src/lib/vision/core
mkdir -p src/lib/vision/exercises
mkdir -p src/lib/vision/utils
mkdir -p src/lib/hybridAI

# Create component directories
mkdir -p src/components/vision

# Create API routes
mkdir -p src/app/api/vision
mkdir -p src/app/api/ai/form-feedback

# Create test page
mkdir -p src/app/live-workout
```

---

## Day 2-3: MediaPipe Integration (6 hours)

### Step 1: Create PoseDetector Class

Create file: `src/lib/vision/core/poseDetector.ts`

```typescript
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export class PoseDetector {
  private pose: Pose | null = null;
  private camera: Camera | null = null;

  async initialize(videoElement: HTMLVideoElement): Promise<void> {
    this.pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.pose) {
          await this.pose.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });

    await this.camera.start();
  }

  onResults(callback: (landmarks: PoseLandmark[]) => void): void {
    if (this.pose) {
      this.pose.onResults((results) => {
        if (results.poseLandmarks) {
          callback(results.poseLandmarks as PoseLandmark[]);
        }
      });
    }
  }

  dispose(): void {
    this.camera?.stop();
    this.pose?.close();
  }

  getVisibilityScore(landmarks: PoseLandmark[]): number {
    const avgVisibility = landmarks.reduce((sum, lm) =>
      sum + lm.visibility, 0) / landmarks.length;
    return Math.round(avgVisibility * 100);
  }
}
```

### Step 2: Create Test Page

Create file: `src/app/live-workout/page.tsx`

```typescript
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PoseDetector, PoseLandmark } from '@/lib/vision/core/poseDetector';

export default function LiveWorkoutTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [visibilityScore, setVisibilityScore] = useState(0);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!videoRef.current) return;

    const detector = new PoseDetector();
    let frameCount = 0;
    let lastTime = Date.now();

    detector.initialize(videoRef.current).then(() => {
      setIsActive(true);
    });

    detector.onResults((landmarks: PoseLandmark[]) => {
      // Calculate FPS
      frameCount++;
      const now = Date.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Calculate visibility
      const score = detector.getVisibilityScore(landmarks);
      setVisibilityScore(score);

      // Log landmarks for verification
      console.log('Landmarks detected:', landmarks.length);
    });

    return () => {
      detector.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          MediaPipe Test - Week 1 Proof-of-Concept
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
              />

              {/* Status Badge */}
              {isActive && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  ACTIVE
                </div>
              )}
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Performance</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">FPS</p>
                  <p className={`text-3xl font-bold ${
                    fps >= 20 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {fps}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: ≥20 FPS
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className={`text-3xl font-bold ${
                    visibilityScore >= 70 ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {visibilityScore}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: ≥70%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {isActive ? '✅' : '⏳'}
                  <span>MediaPipe Loaded</span>
                </div>
                <div className="flex items-center gap-2">
                  {fps >= 20 ? '✅' : '❌'}
                  <span>FPS Target Met</span>
                </div>
                <div className="flex items-center gap-2">
                  {visibilityScore >= 70 ? '✅' : '⚠️'}
                  <span>Visibility Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Week 1 Success Criteria</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ MediaPipe loads and initializes</li>
            <li>✓ Webcam stream displays</li>
            <li>✓ FPS ≥ 20 (Green = Pass)</li>
            <li>✓ Visibility ≥ 70% (Full body visible)</li>
            <li>✓ 33 landmarks detected (Check console)</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            If all criteria met → Proceed to Day 4 (Rep Counter)
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 3: Test MediaPipe

```bash
# Run development server
npm run dev

# Navigate to http://localhost:3000/live-workout

# Expected results:
# - Webcam activates
# - Video feed displays
# - FPS shows 20-30 (green)
# - Visibility shows 70-100% (green)
# - Console logs show 33 landmarks
```

**SUCCESS GATE:** If FPS < 20 or MediaPipe fails → STOP and reassess technology choice

---

## Day 4-5: Basic Rep Counter (6 hours)

### Step 1: Create Geometry Utilities

Create file: `src/lib/vision/utils/geometry.ts`

```typescript
import { PoseLandmark } from '../core/poseDetector';

export function calculateAngle(
  point1: PoseLandmark,
  point2: PoseLandmark,
  point3: PoseLandmark
): number {
  const radians = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                  Math.atan2(point1.y - point2.y, point1.x - point2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return Math.round(angle);
}

export function calculateDistance(
  point1: PoseLandmark,
  point2: PoseLandmark
): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

### Step 2: Create Squat Recognizer

Create file: `src/lib/vision/exercises/squatRecognizer.ts`

```typescript
import { PoseLandmark } from '../core/poseDetector';
import { calculateAngle } from '../utils/geometry';

type SquatPhase = 'standing' | 'descending' | 'bottom' | 'ascending';

export class SquatRecognizer {
  private state: SquatPhase = 'standing';
  private repCount: number = 0;

  analyze(landmarks: PoseLandmark[]): {
    repCounted: boolean;
    count: number;
    currentAngle: number;
    phase: SquatPhase;
  } {
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);

    let repCounted = false;

    if (this.state === 'standing' && kneeAngle < 160) {
      this.state = 'descending';
      console.log('Descending...');
    } else if (this.state === 'descending' && kneeAngle < 100) {
      this.state = 'bottom';
      console.log('Bottom position');
    } else if (this.state === 'bottom' && kneeAngle > 110) {
      this.state = 'ascending';
      console.log('Ascending...');
    } else if (this.state === 'ascending' && kneeAngle > 160) {
      this.state = 'standing';
      this.repCount++;
      repCounted = true;
      console.log('Rep counted!', this.repCount);
    }

    return {
      repCounted,
      count: this.repCount,
      currentAngle: kneeAngle,
      phase: this.state
    };
  }

  reset(): void {
    this.state = 'standing';
    this.repCount = 0;
  }
}
```

### Step 3: Integrate Rep Counter into Test Page

Update `src/app/live-workout/page.tsx`:

```typescript
// Add import
import { SquatRecognizer } from '@/lib/vision/exercises/squatRecognizer';

// Add state
const [repCount, setRepCount] = useState(0);
const [currentAngle, setCurrentAngle] = useState(180);
const [phase, setPhase] = useState<string>('standing');

// Inside useEffect, after detector initialization
const recognizer = new SquatRecognizer();

detector.onResults((landmarks: PoseLandmark[]) => {
  // ... existing FPS and visibility code ...

  // Add rep counting
  const analysis = recognizer.analyze(landmarks);
  setRepCount(analysis.count);
  setCurrentAngle(analysis.currentAngle);
  setPhase(analysis.phase);
});

// Add to UI (in stats panel)
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-2">Rep Counter</h3>
  <p className="text-6xl font-bold text-primary">{repCount}</p>
  <p className="text-sm text-muted-foreground mt-2">Squats</p>
  <p className="text-xs text-muted-foreground mt-4">
    Angle: {currentAngle}° | Phase: {phase}
  </p>
</div>
```

### Step 4: Test Rep Counter

```bash
# Perform 10 squats in front of webcam
# Expected: Counter increments from 0 → 10
# Acceptable: 10 ± 1 (90% accuracy)
```

**Validation Checklist:**
- [ ] Counter starts at 0
- [ ] Each full squat increments counter
- [ ] Partial squats don't count
- [ ] Accuracy ≥ 85% (9-11 reps for 10 actual squats)

---

## Day 6: Benchmarking (2 hours)

### Create Benchmark Report

Create file: `WEEK1_BENCHMARK_REPORT.md`

```markdown
# Week 1 Benchmark Results

## Test Date
[Insert date]

## Test Environment
- Device: [MacBook M2 / iPhone 12 / etc.]
- Browser: [Chrome 120 / Safari 17 / etc.]
- OS: [macOS 14 / iOS 17 / etc.]

## Performance Results

### FPS Performance
| Device | Browser | Avg FPS | Min FPS | Max FPS | Pass/Fail |
|--------|---------|---------|---------|---------|-----------|
| MacBook M2 | Chrome | 30 | 28 | 32 | ✅ Pass |
| iPhone 12 | Safari | 22 | 18 | 25 | ✅ Pass |
| [Add more] | | | | | |

**Target:** ≥20 FPS
**Result:** [PASS / FAIL]

### Rep Counting Accuracy
| Test # | Actual Squats | Counted Reps | Accuracy | Pass/Fail |
|--------|---------------|--------------|----------|-----------|
| 1 | 10 | 10 | 100% | ✅ Pass |
| 2 | 10 | 9 | 90% | ✅ Pass |
| 3 | 10 | 11 | 90% | ✅ Pass |
| 4 | 20 | 19 | 95% | ✅ Pass |
| 5 | 20 | 20 | 100% | ✅ Pass |

**Average Accuracy:** [Insert %]
**Target:** ≥85%
**Result:** [PASS / FAIL]

## Observations

### Strengths
- [e.g., "Very fast on M2 MacBook, consistent 30 FPS"]
- [e.g., "Rep counting highly accurate for full-depth squats"]

### Issues Identified
- [e.g., "FPS drops to 18 in low lighting"]
- [e.g., "Partial squats sometimes counted incorrectly"]

### Recommendations
- [e.g., "Add lighting check in pre-workout setup"]
- [e.g., "Tune knee angle threshold from 100° to 95°"]

## Decision: PROCEED or PIVOT?

Based on results:
- [✅] PROCEED to Week 2 (all targets met)
- [ ] PIVOT to alternative technology (targets not met)
- [ ] REDUCE SCOPE (partial targets met)

## Next Steps
1. [e.g., "Implement push-up recognizer"]
2. [e.g., "Add form analysis for squats"]
3. [e.g., "Submit IRB application"]
```

Fill out this report with YOUR actual test results.

---

## Day 7: IRB Application & Supervisor Meeting (3 hours)

### IRB Application Outline

Create file: `IRB_APPLICATION_DRAFT.md`

```markdown
# IRB Application: Hybrid AI Fitness Coaching User Study

## Study Title
Evaluating the Effectiveness of a Hybrid AI System Combining Computer Vision and Natural Language Processing for Real-Time Fitness Coaching

## Principal Investigator
[Your Name]
[University Email]
[Student ID]

## Faculty Supervisor
[Supervisor Name]
[Supervisor Email]

## Study Purpose
To evaluate whether a hybrid AI system that combines real-time pose detection (MediaPipe) with conversational AI (GPT-4) improves exercise form, user engagement, and workout adherence compared to traditional app-based coaching.

## Research Questions
1. Does real-time visual feedback improve exercise form quality?
2. Does hybrid AI coaching increase workout completion rates?
3. How do users perceive the relevance and helpfulness of AI-generated form corrections?

## Study Design
- Controlled between-subjects study
- Sample size: 15 participants (7 control, 8 experimental)
- Duration: 7 days, 3 workout sessions per participant
- Location: [University gym / home-based / hybrid]

## Participants
- Inclusion: Ages 18-65, no serious injuries, able to perform bodyweight exercises
- Exclusion: Cardiovascular issues, joint problems, pregnancy
- Recruitment: University gym members, student volunteers, social media

## Procedures
1. Informed consent
2. Pre-study questionnaire (demographics, fitness level)
3. Group assignment (randomized)
4. Training session (how to use app)
5. Three workout sessions over 7 days
6. Post-session questionnaires
7. Final interview (optional)

## Data Collection
- Objective: Rep counts, form scores, session duration, completion rates
- Subjective: User satisfaction (SUS), feedback relevance ratings, qualitative comments
- Storage: Encrypted MongoDB, pose landmarks only (no video stored)

## Risks & Mitigation
- Minimal risk: Typical exercise-related risks (muscle soreness)
- Mitigation: Warm-up required, clear instructions, ability to stop anytime
- Privacy: No video stored, data anonymized, local processing

## Benefits
- Participants: Free fitness coaching, personalized feedback
- Society: Advance knowledge in AI-assisted fitness technology

## Consent Form
[See attached CONSENT_FORM.md]

## Data Management Plan
- Collection: App logs to secure MongoDB
- Storage: Encrypted, password-protected
- Retention: 2 years post-study
- Sharing: Anonymized data may be published in thesis/papers
- Disposal: Secure deletion after retention period

## Signatures
[Your Signature]
[Date]

[Supervisor Signature]
[Date]
```

### Informed Consent Form

Create file: `CONSENT_FORM.md`

```markdown
# Informed Consent Form
## Hybrid AI Fitness Coaching User Study

### Study Information
**Title:** Evaluating Hybrid AI System for Real-Time Fitness Coaching
**Investigator:** [Your Name], [Email], [Phone]
**Supervisor:** [Supervisor Name], [Email]

### Purpose
You are invited to participate in a research study evaluating a new fitness app that uses AI and computer vision to provide real-time exercise coaching.

### What You Will Do
If you agree to participate:
1. Complete a short questionnaire about your fitness background
2. Use the fitness app for 3 workout sessions over 7 days
3. Each session: 20-30 minutes of guided exercises
4. Provide feedback after each session
5. Complete a final satisfaction survey

### Risks
- Minimal risk: Normal exercise-related risks (muscle soreness, minor strain)
- You can stop at any time if you feel uncomfortable

### Benefits
- Free personalized fitness coaching
- Contribute to advancing fitness technology
- No monetary compensation

### Privacy & Confidentiality
- Your video is NOT stored; only pose landmarks (33 numbers per frame)
- All data is anonymized and encrypted
- Results may be published, but you will not be identifiable

### Voluntary Participation
- Participation is completely voluntary
- You can withdraw at any time without penalty
- Withdrawal will not affect your relationship with the university

### Questions
Contact [Your Name] at [Email] with any questions.

### Consent
By signing below, I confirm:
- I have read and understood this form
- I have had the opportunity to ask questions
- I voluntarily agree to participate

**Participant Name:** _______________________________

**Signature:** ___________________  **Date:** __________

**Investigator Signature:** ___________________  **Date:** __________
```

### Supervisor Meeting Agenda

Prepare for Week 1 review meeting:

```markdown
# Week 1 Review Meeting Agenda

## Date: [Schedule for end of Week 1]

## Attendees
- [Your Name]
- [Supervisor Name]

## Agenda

### 1. Demo: MediaPipe Proof-of-Concept (10 min)
- Show live workout page
- Demonstrate squat rep counting
- Present FPS benchmarks

### 2. Results Review (5 min)
- Share WEEK1_BENCHMARK_REPORT.md
- Discuss accuracy results
- Address any issues found

### 3. Decision Point: Proceed or Pivot? (10 min)
- Review success criteria
  - ✅ FPS ≥ 20 on target devices
  - ✅ Rep counting accuracy ≥ 85%
  - ✅ MediaPipe stable and functional
- **Recommendation:** [PROCEED / PIVOT / REDUCE SCOPE]

### 4. IRB Application (5 min)
- Present IRB draft
- Request supervisor signature
- Discuss timeline for submission

### 5. Week 2 Plan (5 min)
- Form analysis implementation
- Push-up recognizer
- Any adjustments based on Week 1 learnings

### 6. Questions & Concerns (5 min)

## Materials to Bring
- Laptop with live demo ready
- WEEK1_BENCHMARK_REPORT.md (printed)
- IRB_APPLICATION_DRAFT.md (printed)
- FINAL_IMPLEMENTATION_STRATEGY.md (reference)

## Expected Outcome
- [ ] Supervisor approves proceeding to Week 2
- [ ] IRB application signed and ready for submission
- [ ] Clarification on any technical concerns
```

---

## Week 1 Success Checklist

At the end of Week 1, you should have:

### Technical Deliverables
- [ ] MediaPipe integrated into Next.js app
- [ ] PoseDetector class working
- [ ] Squat rep counter functional
- [ ] Test page at `/live-workout` operational
- [ ] FPS ≥ 20 on 2+ devices
- [ ] Rep counting accuracy ≥ 85%

### Documentation
- [ ] WEEK1_BENCHMARK_REPORT.md completed
- [ ] IRB_APPLICATION_DRAFT.md written
- [ ] CONSENT_FORM.md prepared
- [ ] Supervisor meeting scheduled

### Decision
- [ ] GO/NO-GO decision made
- [ ] Supervisor approval obtained
- [ ] IRB application submitted

---

## Troubleshooting Common Issues

### Issue 1: MediaPipe Not Loading
```
Error: "Failed to load model"
```

**Solution:**
```typescript
// Check CDN URL is correct
locateFile: (file) =>
  `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`

// Or use local copy
npm install @mediapipe/pose@latest
```

### Issue 2: Low FPS (<15 FPS)
```
Possible causes:
- modelComplexity too high
- Video resolution too high
- Browser throttling
```

**Solution:**
```typescript
// Reduce model complexity
this.pose.setOptions({
  modelComplexity: 0, // Change from 1 to 0
  // ... other options
});

// Reduce video resolution
this.camera = new Camera(videoElement, {
  width: 480,  // Reduced from 640
  height: 360, // Reduced from 480
  // ...
});
```

### Issue 3: Webcam Permission Denied
```
Error: "Permission denied"
```

**Solution:**
```typescript
// Add error handling
try {
  await this.camera.start();
} catch (error) {
  console.error('Camera permission denied:', error);
  alert('Please enable camera permissions in your browser settings.');
}
```

### Issue 4: Rep Counter Inaccurate
```
Counting too many or too few reps
```

**Solution:**
```typescript
// Tune angle thresholds
// Current: 160° standing, 100° bottom
// Try adjusting:
if (kneeAngle < 155) { // More strict for descending
  this.state = 'descending';
}
// And/or
if (kneeAngle < 95) { // Deeper squat required
  this.state = 'bottom';
}
```

---

## Next Steps After Week 1

If Week 1 is successful:

### Week 2 Priorities
1. Implement form analysis for squats
2. Build push-up recognizer
3. Create calorie estimator
4. Submit IRB application
5. Begin Week 2 tasks from FINAL_IMPLEMENTATION_STRATEGY.md

### If Week 1 Targets Not Met

**Scenario A: FPS < 20**
- Reduce model complexity
- Lower video resolution
- Try TensorFlow MoveNet as alternative
- Re-test and document

**Scenario B: Rep Accuracy < 85%**
- Tune angle thresholds
- Add hysteresis to state machine
- Test with different users
- Consider reducing scope to 2 exercises

**Scenario C: MediaPipe Unstable**
- Check browser compatibility
- Test different MediaPipe versions
- Consider server-side processing (not ideal)
- Evaluate alternative: TensorFlow PoseNet

---

## Important Reminders

1. **Git Commit Regularly**
```bash
git add .
git commit -m "Week 1: MediaPipe integration and squat rep counter"
git push
```

2. **Document Everything**
- Screenshot successful tests
- Record FPS benchmarks
- Log any issues encountered
- Keep notes for thesis

3. **Time Management**
- Set timer for each task
- Don't get stuck on perfection
- Focus on proof-of-concept
- Polish comes later

4. **Ask for Help**
- Supervisor: Technical guidance
- Peers: Testing volunteers
- Online: MediaPipe community

---

## Success Definition

**Week 1 is successful if:**
- You can demonstrate working squat rep counter
- FPS is acceptable (≥20)
- You feel confident proceeding to Week 2
- Supervisor approves continuation

**Even if not perfect:**
- 80-85% accuracy is acceptable for Week 1
- FPS 18-20 is workable (can optimize later)
- Minor bugs are expected

**The goal:** VALIDATE FEASIBILITY, not build perfect system

---

## Final Motivation

Week 1 is the MOST CRITICAL week. If you complete these tasks:
- You've de-risked the entire project
- You have a working foundation
- You can confidently proceed
- Your thesis novelty is validated

**Start TODAY. Don't wait for "perfect conditions."**

Good luck! 🚀

---

**Quick Start Status:**
- [ ] Environment setup complete
- [ ] MediaPipe test page working
- [ ] Rep counter functional
- [ ] Benchmarks recorded
- [ ] IRB draft prepared
- [ ] Week 1 complete ✅
