# Quick Reference Guide
**Fitness AI Coach - CV Feature**

---

## 🚀 Quick Start

### Development Server
```bash
npm run dev
# Server: http://localhost:3001
# Live Workout: http://localhost:3001/live-workout
```

### Test the CV Feature
1. Navigate to `/live-workout`
2. Select exercise (Squats | Push-ups | Plank)
3. Click "Start Workout"
4. Allow camera access
5. Perform exercise!

---

## 📁 Key Files

### Exercise Detectors
```
src/lib/vision/exercises/
├── squatDetector.ts      # Knee angle state machine
├── pushupDetector.ts     # Elbow + body alignment
└── plankDetector.ts      # Hold-time tracking
```

### Core Infrastructure
```
src/lib/vision/
├── core/poseDetector.ts  # MediaPipe wrapper
├── utils/geometry.ts     # Angle calculations
└── types.ts              # TypeScript interfaces
```

### UI Components
```
src/components/vision/
└── LiveWorkoutSession.tsx  # Main workout UI
src/app/live-workout/
└── page.tsx               # Workout route
```

---

## 🎯 Biomechanical Thresholds

### Squats
- **Down:** Knee < 100°
- **Up:** Knee > 160°
- **Form Range:** 70-110° (optimal)
- **Calories:** 0.32 kcal/rep

### Push-ups
- **Down:** Elbow < 90°
- **Up:** Elbow > 160°
- **Form Range:** 70-100° (optimal)
- **Body Alignment:** >160°
- **Calories:** 0.29 kcal/rep

### Plank
- **Body Alignment:** 160-190°
- **Elbow Angle:** 80-100°
- **Knee Extension:** >160°
- **Stability:** 30 frames (~1 sec)
- **Calories:** 0.058 kcal/sec

---

## 🔧 Common Commands

### Git
```bash
git status              # Check changes
git add .               # Stage all
git commit -m "msg"     # Commit
git push origin main    # Push to remote
git log --oneline -5    # View commits
```

### Development
```bash
npm install             # Install dependencies
npm run dev             # Start dev server
npm run build           # Production build
npm run lint            # Run linter
```

---

## 📊 Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Frame Rate | 20-30 FPS | ✅ 20-30 |
| Latency | <100ms | ✅ 33-50ms |
| Memory | <10MB | ✅ ~5MB |

---

## 📝 Implementation Checklist

### ✅ Week 1 (Complete)
- [x] MediaPipe integration
- [x] SquatDetector
- [x] PoseDetector wrapper
- [x] Geometry utilities
- [x] LiveWorkoutSession UI
- [x] /live-workout route
- [x] Navigation link

### ✅ Week 2 (Complete)
- [x] PushupDetector
- [x] PlankDetector
- [x] Exercise selector UI
- [x] Exercise switching
- [x] Documentation

### 🔄 Week 3 (Pending)
- [ ] Joint highlighting
- [ ] Tempo analysis
- [ ] ROM tracking
- [ ] Calibration mode
- [ ] Performance optimization

---

## 🐛 Troubleshooting

### Camera Not Working
1. Check browser permissions (Chrome: Settings > Privacy)
2. Ensure HTTPS or localhost
3. Try different browser (Chrome recommended)
4. Check MediaPipe CDN access

### Low Frame Rate
1. Reduce model complexity (poseDetector.ts line 28)
2. Lower video resolution (1280x720 → 640x480)
3. Close other applications
4. Use dedicated GPU

### Form Not Detected
1. Ensure full body is visible
2. Check landmark visibility (console logs)
3. Verify camera angle (side view recommended)
4. Adequate lighting required

---

## 📖 Documentation

- **Week 1:** WEEK1_IMPLEMENTATION_SUMMARY.md
- **Week 2:** WEEK2_IMPLEMENTATION_SUMMARY.md
- **Project Status:** PROJECT_STATUS.md
- **Full Strategy:** FINAL_IMPLEMENTATION_STRATEGY.md
- **Phase-I Report:** FYDP_Phase_I_Report.md

---

## 🔗 Important Links

### Development
- **Local Server:** http://localhost:3001
- **Live Workout:** http://localhost:3001/live-workout
- **Dashboard:** http://localhost:3001/dashboard
- **AI Coach:** http://localhost:3001/ai-coach

### External
- **MediaPipe Docs:** https://google.github.io/mediapipe/solutions/pose.html
- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

## 💡 Quick Tips

### Adding a New Exercise
1. Create `newExerciseDetector.ts` in `src/lib/vision/exercises/`
2. Extend from common patterns (see squatDetector.ts)
3. Define biomechanical thresholds
4. Implement `process()`, `getMetrics()`, `reset()`
5. Update `LiveWorkoutSession.tsx` selector
6. Add to `ExerciseType` union type

### Modifying Form Thresholds
Edit detector files:
- `SQUAT_DOWN_THRESHOLD` (squatDetector.ts:20)
- `PUSHUP_DOWN_THRESHOLD` (pushupDetector.ts:18)
- `PLANK_BODY_ALIGNMENT_MIN` (plankDetector.ts:19)

### Changing Calorie Formulas
Edit `getMetrics()` in each detector:
- Squat: `squatDetector.ts:218` (0.32 kcal/rep)
- Push-up: `pushupDetector.ts:221` (0.29 kcal/rep)
- Plank: `plankDetector.ts:237` (0.058 kcal/sec)

---

## 🎓 Academic Notes

### Research Questions
- **RQ1:** CV+LLM vs CV-only accuracy
- **RQ2:** Real-time feedback impact on injury prevention
- **RQ3:** User engagement vs traditional apps
- **RQ4:** Personalized threshold effectiveness

### User Study Protocol (Week 8)
- **Participants:** 15 (control vs experimental)
- **Duration:** 7 days
- **Metrics:** Accuracy, engagement, satisfaction, injury rate
- **Analysis:** Pre/post assessments, qualitative interviews

### Novelty Claim
First-of-its-kind hybrid AI system integrating:
1. Real-time pose detection (MediaPipe)
2. Biomechanical form analysis (state machines)
3. Natural language coaching (GPT-4) ← Week 5
4. Bidirectional feedback loop

---

## 📞 Support

For issues or questions:
1. Check `PROJECT_STATUS.md` for known issues
2. Review week summaries for implementation details
3. Consult `FINAL_IMPLEMENTATION_STRATEGY.md` for architecture
4. Refer to TypeScript interfaces in `types.ts`

---

**Last Updated:** January 11, 2026
**Version:** 0.2.0 (Week 1+2 Complete)
**Commit:** 528e53c
