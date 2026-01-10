// Comprehensive Exercise Library Seed Data

export const EXERCISES = [
  // ============================================
  // CHEST EXERCISES
  // ============================================
  {
    name: "Barbell Bench Press",
    category: "strength",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "bench"],
    difficulty: "intermediate",
    description: "Classic compound movement for building upper body mass and strength. The bench press is a fundamental exercise for chest development.",
    instructions: [
      "Lie on bench with feet flat on floor",
      "Grip barbell slightly wider than shoulder-width",
      "Unrack bar and position over chest",
      "Lower bar to mid-chest with controlled motion",
      "Press bar back up to starting position",
      "Keep shoulder blades retracted throughout"
    ],
    tips: [
      "Keep shoulder blades retracted and depressed",
      "Maintain natural arch in lower back",
      "Don't bounce bar off chest",
      "Drive through heels for stability",
      "Use full range of motion"
    ],
    caloriesPerRep: 8,
    isCustom: false
  },
  {
    name: "Push-ups",
    category: "strength",
    muscleGroups: ["chest", "triceps", "core"],
    equipment: ["none"],
    difficulty: "beginner",
    description: "Fundamental bodyweight exercise for upper body and core strength. Can be modified for all fitness levels.",
    instructions: [
      "Start in plank position with hands shoulder-width apart",
      "Lower body until chest nearly touches floor",
      "Keep elbows at 45-degree angle",
      "Push back up to starting position",
      "Maintain straight body line throughout"
    ],
    tips: [
      "Engage core to prevent sagging hips",
      "Keep neck neutral, don't look up",
      "Full range of motion for best results",
      "Modify on knees if needed",
      "Focus on quality over quantity"
    ],
    caloriesPerRep: 0.5,
    isCustom: false
  },
  {
    name: "Incline Dumbbell Press",
    category: "strength",
    muscleGroups: ["upper chest", "shoulders", "triceps"],
    equipment: ["dumbbells", "bench"],
    difficulty: "intermediate",
    description: "Targets upper chest fibers with adjustable bench angle. Excellent for balanced chest development.",
    instructions: [
      "Set bench to 30-45 degree incline",
      "Sit with dumbbells on thighs",
      "Lie back and position dumbbells at chest level",
      "Press dumbbells up and slightly inward",
      "Lower with control to starting position"
    ],
    tips: [
      "30-45 degree angle is optimal for upper chest",
      "Don't lock out elbows at top",
      "Keep shoulders back and down",
      "Focus on chest contraction",
      "Avoid excessive arch in back"
    ],
    caloriesPerRep: 6,
    isCustom: false
  },
  {
    name: "Cable Flyes",
    category: "strength",
    muscleGroups: ["chest"],
    equipment: ["cable machine"],
    difficulty: "intermediate",
    description: "Isolation exercise for chest with constant tension throughout range of motion.",
    instructions: [
      "Set cables to chest height",
      "Grab handles and step forward",
      "Lean slightly forward",
      "Bring handles together in front of chest",
      "Squeeze chest at peak contraction",
      "Return to starting position with control"
    ],
    tips: [
      "Keep slight bend in elbows throughout",
      "Focus on chest squeeze, not arm movement",
      "Control the eccentric (stretch) phase",
      "Don't let handles go behind shoulders",
      "Maintain consistent tempo"
    ],
    caloriesPerRep: 4,
    isCustom: false
  },

  // ============================================
  // BACK EXERCISES
  // ============================================
  {
    name: "Deadlifts",
    category: "strength",
    muscleGroups: ["back", "glutes", "hamstrings", "core"],
    equipment: ["barbell"],
    difficulty: "advanced",
    description: "King of compound movements. Builds total body strength and muscle mass, particularly posterior chain.",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend down and grip bar just outside legs",
      "Set back in neutral position, chest up",
      "Drive through heels, pull bar straight up",
      "Stand tall, lock out hips and knees",
      "Lower bar with control, same path"
    ],
    tips: [
      "Keep bar close to body throughout",
      "Maintain neutral spine, no rounding",
      "Lead with chest, not hips",
      "Engage lats to keep bar close",
      "Breathe and brace core before each rep"
    ],
    caloriesPerRep: 12,
    isCustom: false
  },
  {
    name: "Pull-ups",
    category: "strength",
    muscleGroups: ["back", "biceps", "core"],
    equipment: ["pull-up bar"],
    difficulty: "intermediate",
    description: "Essential bodyweight exercise for back width and strength. Excellent for developing V-taper.",
    instructions: [
      "Hang from bar with overhand grip, hands shoulder-width",
      "Engage lats and pull shoulder blades down",
      "Pull yourself up until chin clears bar",
      "Lower with control to full hang",
      "Keep core tight throughout"
    ],
    tips: [
      "Avoid kipping or swinging",
      "Full range of motion is crucial",
      "Use assisted machine or bands if needed",
      "Focus on lat engagement, not arms",
      "Retract shoulder blades at bottom"
    ],
    caloriesPerRep: 6,
    isCustom: false
  },
  {
    name: "Barbell Rows",
    category: "strength",
    muscleGroups: ["back", "biceps", "core"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "Fundamental compound movement for back thickness and strength.",
    instructions: [
      "Bend at hips, slight knee bend",
      "Grip bar slightly wider than shoulder-width",
      "Pull bar to lower chest/upper abdomen",
      "Squeeze shoulder blades together at top",
      "Lower with control"
    ],
    tips: [
      "Keep back flat, not rounded",
      "Pull with elbows, not hands",
      "Don't stand up during rep",
      "Control the weight, no momentum",
      "Engage core for stability"
    ],
    caloriesPerRep: 7,
    isCustom: false
  },
  {
    name: "Lat Pulldowns",
    category: "strength",
    muscleGroups: ["back", "biceps"],
    equipment: ["cable machine"],
    difficulty: "beginner",
    description: "Machine alternative to pull-ups, excellent for building back width and lat development.",
    instructions: [
      "Sit at machine with thighs under pads",
      "Grip bar wider than shoulder-width",
      "Pull bar down to upper chest",
      "Squeeze shoulder blades together",
      "Return to starting position with control"
    ],
    tips: [
      "Lean back slightly, chest up",
      "Pull elbows down and back",
      "Don't use momentum or swing",
      "Full stretch at top of movement",
      "Focus on lat contraction"
    ],
    caloriesPerRep: 5,
    isCustom: false
  },

  // ============================================
  // LEG EXERCISES
  // ============================================
  {
    name: "Barbell Squats",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings", "core"],
    equipment: ["barbell", "squat rack"],
    difficulty: "intermediate",
    description: "The king of leg exercises. Builds massive lower body strength and muscle mass.",
    instructions: [
      "Position bar on upper traps (high bar) or rear delts (low bar)",
      "Stand with feet shoulder-width apart",
      "Descend by breaking at hips and knees simultaneously",
      "Go to at least parallel depth",
      "Drive through heels to stand",
      "Keep chest up and core tight throughout"
    ],
    tips: [
      "Keep knees tracking over toes",
      "Maintain neutral spine",
      "Full depth for best results",
      "Don't let knees cave inward",
      "Breathe and brace before each rep"
    ],
    caloriesPerRep: 10,
    isCustom: false
  },
  {
    name: "Romanian Deadlifts",
    category: "strength",
    muscleGroups: ["hamstrings", "glutes", "lower back"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "Essential hamstring and posterior chain builder with emphasis on eccentric strength.",
    instructions: [
      "Stand holding barbell at hip level",
      "Slight bend in knees",
      "Hinge at hips, push butt back",
      "Lower bar down front of legs",
      "Feel stretch in hamstrings",
      "Return to standing by thrusting hips forward"
    ],
    tips: [
      "Keep bar close to legs",
      "Minimal knee bend throughout",
      "Lead with hips, not shoulders",
      "Don't round lower back",
      "Feel the stretch in hamstrings"
    ],
    caloriesPerRep: 8,
    isCustom: false
  },
  {
    name: "Leg Press",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["leg press machine"],
    difficulty: "beginner",
    description: "Machine-based compound movement for legs, allows heavy loading with less technical demand.",
    instructions: [
      "Sit in machine with back against pad",
      "Place feet shoulder-width on platform",
      "Release safety, lower platform with control",
      "Descend until thighs are parallel or below",
      "Push through heels to extend legs",
      "Don't lock out knees at top"
    ],
    tips: [
      "Keep lower back flat against pad",
      "Full range of motion",
      "Don't lock knees at top",
      "Control the eccentric phase",
      "Foot placement varies target"
    ],
    caloriesPerRep: 7,
    isCustom: false
  },
  {
    name: "Walking Lunges",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["dumbbells"],
    difficulty: "intermediate",
    description: "Dynamic unilateral leg exercise that builds strength, balance, and coordination.",
    instructions: [
      "Hold dumbbells at sides or on shoulders",
      "Step forward into lunge position",
      "Lower back knee toward ground",
      "Push off front foot to step forward",
      "Alternate legs with each step"
    ],
    tips: [
      "Keep torso upright",
      "Front knee shouldn't go past toes",
      "Back knee should nearly touch ground",
      "Maintain balance and control",
      "Can be done bodyweight for beginners"
    ],
    caloriesPerRep: 5,
    isCustom: false
  },

  // ============================================
  // SHOULDER EXERCISES
  // ============================================
  {
    name: "Overhead Press",
    category: "strength",
    muscleGroups: ["shoulders", "triceps", "core"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    description: "Primary compound movement for shoulder development and overhead strength.",
    instructions: [
      "Stand with bar at shoulder height",
      "Grip slightly wider than shoulder-width",
      "Press bar straight overhead",
      "Lock out arms at top",
      "Lower bar with control to shoulders"
    ],
    tips: [
      "Keep core tight and glutes engaged",
      "Don't lean back excessively",
      "Bar path should be straight up",
      "Full lockout at top",
      "Breathe at top of movement"
    ],
    caloriesPerRep: 7,
    isCustom: false
  },
  {
    name: "Lateral Raises",
    category: "strength",
    muscleGroups: ["shoulders"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    description: "Isolation exercise for side deltoids, creates shoulder width and definition.",
    instructions: [
      "Stand with dumbbells at sides",
      "Slight bend in elbows",
      "Raise arms out to sides",
      "Lift to shoulder height",
      "Lower with control"
    ],
    tips: [
      "Lead with elbows, not hands",
      "Don't swing or use momentum",
      "Slight forward lean can help",
      "Keep traps relaxed",
      "Control the negative"
    ],
    caloriesPerRep: 2,
    isCustom: false
  },
  {
    name: "Face Pulls",
    category: "strength",
    muscleGroups: ["rear deltoids", "upper back"],
    equipment: ["cable machine"],
    difficulty: "beginner",
    description: "Essential for shoulder health and rear delt development. Counters pressing movements.",
    instructions: [
      "Set cable to face height",
      "Use rope attachment",
      "Pull rope toward face",
      "Separate hands at end range",
      "Focus on rear delt contraction"
    ],
    tips: [
      "Keep elbows high throughout",
      "Think about pulling rope apart",
      "Don't use heavy weight",
      "High reps for shoulder health",
      "Squeeze shoulder blades together"
    ],
    caloriesPerRep: 3,
    isCustom: false
  },

  // ============================================
  // ARM EXERCISES
  // ============================================
  {
    name: "Barbell Curls",
    category: "strength",
    muscleGroups: ["biceps"],
    equipment: ["barbell"],
    difficulty: "beginner",
    description: "Classic bicep mass builder, fundamental for arm development.",
    instructions: [
      "Stand with barbell at arm's length",
      "Grip shoulder-width apart",
      "Curl bar up to shoulders",
      "Squeeze biceps at top",
      "Lower with control"
    ],
    tips: [
      "Keep elbows stationary",
      "Don't swing or use momentum",
      "Full range of motion",
      "Control the eccentric",
      "Slight lean back is okay"
    ],
    caloriesPerRep: 3,
    isCustom: false
  },
  {
    name: "Tricep Dips",
    category: "strength",
    muscleGroups: ["triceps", "chest", "shoulders"],
    equipment: ["dip bars"],
    difficulty: "intermediate",
    description: "Compound movement for triceps, chest, and shoulders. Excellent mass builder.",
    instructions: [
      "Grip dip bars, arms straight",
      "Lower body by bending elbows",
      "Descend until upper arms parallel to ground",
      "Push back up to starting position",
      "Keep body relatively upright for triceps focus"
    ],
    tips: [
      "Don't go too low if shoulders hurt",
      "Lean forward for more chest",
      "Upright for more triceps",
      "Add weight when bodyweight is easy",
      "Full range of motion"
    ],
    caloriesPerRep: 5,
    isCustom: false
  },
  {
    name: "Overhead Tricep Extension",
    category: "strength",
    muscleGroups: ["triceps"],
    equipment: ["dumbbell"],
    difficulty: "beginner",
    description: "Isolation exercise for long head of triceps, creates thickness in upper arm.",
    instructions: [
      "Hold single dumbbell overhead",
      "Lower dumbbell behind head",
      "Keep elbows pointing forward",
      "Extend arms back to starting position",
      "Focus on tricep contraction"
    ],
    tips: [
      "Keep elbows stationary",
      "Full stretch at bottom",
      "Don't let elbows flare out",
      "Control the weight",
      "Can use both hands on one dumbbell"
    ],
    caloriesPerRep: 3,
    isCustom: false
  },
  {
    name: "Hammer Curls",
    category: "strength",
    muscleGroups: ["biceps", "forearms"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    description: "Targets brachialis and brachioradialis for arm thickness and forearm development.",
    instructions: [
      "Hold dumbbells with neutral grip (palms facing each other)",
      "Curl dumbbells up keeping palms neutral",
      "Squeeze at top",
      "Lower with control"
    ],
    tips: [
      "Keep elbows stationary",
      "Neutral grip throughout",
      "Don't swing dumbbells",
      "Alternate or do together",
      "Focus on forearm engagement"
    ],
    caloriesPerRep: 2,
    isCustom: false
  },

  // ============================================
  // CORE EXERCISES
  // ============================================
  {
    name: "Plank Hold",
    category: "strength",
    muscleGroups: ["core", "abs"],
    equipment: ["none"],
    difficulty: "beginner",
    description: "Isometric core exercise that builds endurance and stability throughout entire midsection.",
    instructions: [
      "Start in push-up position on forearms",
      "Body in straight line from head to heels",
      "Engage core and glutes",
      "Hold position for time",
      "Don't let hips sag or pike up"
    ],
    tips: [
      "Squeeze glutes hard",
      "Pull belly button to spine",
      "Breathe normally",
      "Quality over duration",
      "Can modify on knees"
    ],
    caloriesPerRep: 0.2,
    isCustom: false
  },
  {
    name: "Bicycle Crunches",
    category: "strength",
    muscleGroups: ["abs", "obliques"],
    equipment: ["none"],
    difficulty: "beginner",
    description: "Dynamic ab exercise that targets rectus abdominis and obliques simultaneously.",
    instructions: [
      "Lie on back, hands behind head",
      "Bring opposite elbow to opposite knee",
      "Extend other leg straight",
      "Alternate sides in pedaling motion",
      "Focus on rotating torso"
    ],
    tips: [
      "Don't pull on neck",
      "Controlled movement, not speed",
      "Fully extend leg",
      "Exhale as you crunch",
      "Keep lower back pressed to floor"
    ],
    caloriesPerRep: 0.3,
    isCustom: false
  },
  {
    name: "Hanging Leg Raises",
    category: "strength",
    muscleGroups: ["abs", "hip flexors"],
    equipment: ["pull-up bar"],
    difficulty: "advanced",
    description: "Advanced ab exercise that builds serious core strength and six-pack definition.",
    instructions: [
      "Hang from pull-up bar",
      "Keep legs straight (or bent for easier version)",
      "Raise legs to horizontal or higher",
      "Lower with control",
      "Avoid swinging"
    ],
    tips: [
      "Don't use momentum",
      "Posterior pelvic tilt at top",
      "Bend knees to make easier",
      "Control the eccentric",
      "Engage lats for stability"
    ],
    caloriesPerRep: 4,
    isCustom: false
  },

  // ============================================
  // CARDIO EXERCISES
  // ============================================
  {
    name: "Running",
    category: "cardio",
    muscleGroups: ["legs", "cardiovascular"],
    equipment: ["none"],
    difficulty: "beginner",
    description: "Classic cardiovascular exercise. Burns calories, improves endurance and heart health.",
    instructions: [
      "Maintain upright posture",
      "Land mid-foot, not heel",
      "Swing arms naturally",
      "Keep cadence around 170-180 steps/min",
      "Breathe rhythmically"
    ],
    tips: [
      "Start with walk-run intervals if new",
      "Proper running shoes are important",
      "Warm up before, cool down after",
      "Vary pace and terrain",
      "Listen to your body"
    ],
    caloriesPerRep: 100, // per 10 minutes
    isCustom: false
  },
  {
    name: "Jump Rope",
    category: "cardio",
    muscleGroups: ["calves", "shoulders", "cardiovascular"],
    equipment: ["jump rope"],
    difficulty: "beginner",
    description: "High-intensity cardio that improves coordination, burns calories, and builds calf endurance.",
    instructions: [
      "Hold rope handles at hip height",
      "Jump with both feet together",
      "Small jumps, just clear rope",
      "Land on balls of feet",
      "Maintain steady rhythm"
    ],
    tips: [
      "Keep jumps small and quick",
      "Rotate rope with wrists, not arms",
      "Stay on balls of feet",
      "Start with 30-second intervals",
      "Excellent warm-up exercise"
    ],
    caloriesPerRep: 12, // per minute
    isCustom: false
  },
  {
    name: "Burpees",
    category: "cardio",
    muscleGroups: ["full body", "cardiovascular"],
    equipment: ["none"],
    difficulty: "intermediate",
    description: "Full-body conditioning exercise that combines strength and cardio. Highly effective calorie burner.",
    instructions: [
      "Start standing",
      "Drop into squat, hands on ground",
      "Jump feet back to plank",
      "Optional push-up",
      "Jump feet back to squat",
      "Explode up with jump"
    ],
    tips: [
      "Maintain core engagement",
      "Modify by stepping instead of jumping",
      "Keep good form over speed",
      "Great for HIIT workouts",
      "Catch your breath between reps if needed"
    ],
    caloriesPerRep: 10,
    isCustom: false
  },
  {
    name: "Cycling",
    category: "cardio",
    muscleGroups: ["legs", "cardiovascular"],
    equipment: ["bicycle", "stationary bike"],
    difficulty: "beginner",
    description: "Low-impact cardio excellent for endurance, leg strength, and cardiovascular health.",
    instructions: [
      "Adjust seat height properly",
      "Maintain steady cadence (70-90 RPM)",
      "Keep upper body relaxed",
      "Vary resistance and speed",
      "Breathe deeply and rhythmically"
    ],
    tips: [
      "Proper bike fit prevents injury",
      "Great low-impact alternative to running",
      "Interval training boosts results",
      "Works well for active recovery",
      "Can be high or low intensity"
    ],
    caloriesPerRep: 80, // per 10 minutes
    isCustom: false
  },
];
