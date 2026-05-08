export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration: string;
  tips: string[];
}

export interface WorkoutRoutine {
  weeklyPlan: WorkoutDay[];
  generalNotes: string[];
  nutrition: string[];
}

// ---------------------------------------------------------------------------
// Templates — one per goal × experience combination (12 total)
// ---------------------------------------------------------------------------

const TEMPLATES: Record<string, WorkoutRoutine> = {

  // ── WEIGHT LOSS ─────────────────────────────────────────────────────────

  weight_loss_beginner: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Full Body + Cardio',
        duration: '45-60 minutes',
        exercises: [
          { name: 'Treadmill Walk/Jog', sets: '1', reps: '15 min', rest: '-', notes: 'Warm-up' },
          { name: 'Bodyweight Squats', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Push-ups (modified)', sets: '3', reps: '8-12', rest: '60s' },
          { name: 'Dumbbell Rows', sets: '3', reps: '12', rest: '60s' },
          { name: 'Plank Hold', sets: '3', reps: '20-30s', rest: '45s' },
          { name: 'Stationary Bike', sets: '1', reps: '10 min', rest: '-', notes: 'Cool down' },
        ],
        tips: ['Focus on form over speed', 'Stay hydrated', 'Rest when needed'],
      },
      {
        day: 'Wednesday',
        focus: 'Cardio + Core',
        duration: '40-50 minutes',
        exercises: [
          { name: 'Elliptical', sets: '1', reps: '20 min', rest: '-', notes: 'Moderate pace' },
          { name: 'Mountain Climbers', sets: '3', reps: '15', rest: '45s' },
          { name: 'Bicycle Crunches', sets: '3', reps: '20', rest: '45s' },
          { name: 'Russian Twists', sets: '3', reps: '15/side', rest: '45s' },
          { name: 'Walking Lunges', sets: '3', reps: '10/leg', rest: '60s' },
        ],
        tips: ['Consistent cardio pace', 'Engage core throughout'],
      },
      {
        day: 'Friday',
        focus: 'Circuit Training',
        duration: '45 minutes',
        exercises: [
          { name: 'Jump Rope', sets: '3', reps: '1 min', rest: '30s' },
          { name: 'Goblet Squats', sets: '3', reps: '12', rest: '45s' },
          { name: 'Dumbbell Press', sets: '3', reps: '10', rest: '45s' },
          { name: 'Lat Pulldowns', sets: '3', reps: '12', rest: '45s' },
          { name: 'Burpees', sets: '3', reps: '8', rest: '60s' },
        ],
        tips: ['Keep rest periods short', 'Circuit style — minimal rest between exercises'],
      },
    ],
    generalNotes: [
      '3 workouts per week with rest days in between',
      'Start with lighter weights and focus on form',
      'Gradually increase intensity every 2 weeks',
    ],
    nutrition: [
      'Aim for a 300-500 calorie daily deficit',
      'Prioritise protein (chicken, fish, eggs, legumes)',
      'Drink 2-3 litres of water daily',
      'Avoid processed foods and sugary drinks',
    ],
  },

  weight_loss_intermediate: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Upper Body + HIIT',
        duration: '60 minutes',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: '4', reps: '10-12', rest: '60s' },
          { name: 'Cable Rows', sets: '4', reps: '12', rest: '60s' },
          { name: 'Lateral Raises', sets: '3', reps: '15', rest: '45s' },
          { name: 'Tricep Pushdowns', sets: '3', reps: '15', rest: '45s' },
          { name: 'HIIT Intervals (bike/row)', sets: '6', reps: '30s on / 30s off', rest: '-' },
        ],
        tips: ['Superset upper body moves to keep heart rate elevated'],
      },
      {
        day: 'Tuesday',
        focus: 'Lower Body',
        duration: '55 minutes',
        exercises: [
          { name: 'Barbell Squats', sets: '4', reps: '10', rest: '75s' },
          { name: 'Romanian Deadlifts', sets: '4', reps: '12', rest: '75s' },
          { name: 'Leg Press', sets: '3', reps: '15', rest: '60s' },
          { name: 'Walking Lunges', sets: '3', reps: '12/leg', rest: '60s' },
          { name: 'Calf Raises', sets: '4', reps: '20', rest: '30s' },
        ],
        tips: ['Keep core braced on all lower body movements'],
      },
      {
        day: 'Thursday',
        focus: 'Full Body Circuit',
        duration: '50 minutes',
        exercises: [
          { name: 'Kettlebell Swings', sets: '4', reps: '15', rest: '45s' },
          { name: 'Push-ups', sets: '4', reps: '12-15', rest: '30s' },
          { name: 'Box Jumps', sets: '3', reps: '10', rest: '60s' },
          { name: 'Dumbbell Thrusters', sets: '3', reps: '12', rest: '60s' },
          { name: 'Battle Ropes', sets: '3', reps: '30s', rest: '30s' },
        ],
        tips: ['Circuit format — move quickly between exercises'],
      },
      {
        day: 'Saturday',
        focus: 'Active Recovery + Cardio',
        duration: '45 minutes',
        exercises: [
          { name: 'Brisk Walk or Light Jog', sets: '1', reps: '30 min', rest: '-' },
          { name: 'Foam Rolling', sets: '1', reps: '10 min', rest: '-' },
          { name: 'Stretching / Yoga Sequence', sets: '1', reps: '10 min', rest: '-' },
        ],
        tips: ['Keep intensity low — recovery is part of fat loss'],
      },
    ],
    generalNotes: [
      '4 sessions per week with strategic rest days',
      'Progressive overload every 1-2 weeks',
      'Track workouts to ensure you\'re improving',
    ],
    nutrition: [
      '400-600 calorie daily deficit',
      '1.6g protein per kg of bodyweight',
      'Time carbs around workouts for energy',
      'Avoid alcohol — it stalls fat loss',
    ],
  },

  weight_loss_advanced: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Push (Chest/Shoulders/Triceps) + Metabolic Finisher',
        duration: '70 minutes',
        exercises: [
          { name: 'Barbell Bench Press', sets: '5', reps: '6-8', rest: '90s' },
          { name: 'Overhead Press', sets: '4', reps: '8-10', rest: '75s' },
          { name: 'Cable Flyes', sets: '3', reps: '15', rest: '45s' },
          { name: 'Skull Crushers', sets: '3', reps: '12', rest: '45s' },
          { name: 'Tabata Burpees', sets: '4', reps: '20s on / 10s off', rest: '-' },
        ],
        tips: ['Strength first, conditioning finisher at end'],
      },
      {
        day: 'Tuesday',
        focus: 'Pull (Back/Biceps) + HIIT',
        duration: '70 minutes',
        exercises: [
          { name: 'Weighted Pull-ups', sets: '5', reps: '5-8', rest: '90s' },
          { name: 'Barbell Rows', sets: '4', reps: '8-10', rest: '75s' },
          { name: 'Face Pulls', sets: '3', reps: '20', rest: '45s' },
          { name: 'Barbell Curls', sets: '4', reps: '10-12', rest: '45s' },
          { name: 'Rowing Machine Intervals', sets: '5', reps: '1 min hard / 1 min easy', rest: '-' },
        ],
        tips: ['Control the eccentric on all pulls'],
      },
      {
        day: 'Wednesday',
        focus: 'Legs + Core',
        duration: '75 minutes',
        exercises: [
          { name: 'Barbell Back Squats', sets: '5', reps: '5', rest: '2 min', notes: 'Heavy' },
          { name: 'Bulgarian Split Squats', sets: '4', reps: '10/leg', rest: '75s' },
          { name: 'Leg Curls', sets: '4', reps: '12', rest: '60s' },
          { name: 'Hanging Leg Raises', sets: '4', reps: '15', rest: '45s' },
          { name: 'Ab Wheel Rollouts', sets: '3', reps: '12', rest: '60s' },
        ],
        tips: ['Heavy legs = massive calorie burn post-workout'],
      },
      {
        day: 'Friday',
        focus: 'Full Body Strength + Conditioning',
        duration: '75 minutes',
        exercises: [
          { name: 'Deadlifts', sets: '5', reps: '5', rest: '2 min', notes: 'Submaximal heavy' },
          { name: 'Dumbbell Lunges', sets: '4', reps: '12/leg', rest: '60s' },
          { name: 'Dips', sets: '4', reps: '10-15', rest: '60s' },
          { name: 'Farmer Carries', sets: '4', reps: '30m', rest: '60s' },
          { name: 'Assault Bike Sprints', sets: '6', reps: '15s all-out / 45s easy', rest: '-' },
        ],
        tips: ['Most demanding session — eat well the day before'],
      },
      {
        day: 'Saturday',
        focus: 'Zone 2 Cardio',
        duration: '45-60 minutes',
        exercises: [
          { name: 'Steady-state cardio (run/cycle/swim)', sets: '1', reps: '45-60 min', rest: '-', notes: '60-70% max HR' },
        ],
        tips: ['Conversational pace — you should be able to talk while doing this'],
      },
    ],
    generalNotes: [
      '5 sessions per week — require good recovery habits',
      'Sleep 7-9 hours; poor sleep stalls fat loss',
      'Deload every 4-6 weeks',
    ],
    nutrition: [
      '500 calorie deficit on training days, 300 on rest days',
      '2g protein per kg bodyweight',
      'Carb cycling: higher carbs on leg/deadlift days',
      'Creatine monohydrate (3-5g/day) preserves muscle during deficit',
    ],
  },

  // ── MUSCLE BUILDING ──────────────────────────────────────────────────────

  muscle_building_beginner: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Full Body A',
        duration: '50-60 minutes',
        exercises: [
          { name: 'Goblet Squats', sets: '3', reps: '10', rest: '90s' },
          { name: 'Dumbbell Bench Press', sets: '3', reps: '10', rest: '90s' },
          { name: 'Dumbbell Rows', sets: '3', reps: '10/side', rest: '90s' },
          { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10', rest: '90s' },
          { name: 'Plank', sets: '3', reps: '30s', rest: '45s' },
        ],
        tips: ['Learn the movement patterns first', 'Use a weight you can control for all reps'],
      },
      {
        day: 'Wednesday',
        focus: 'Full Body B',
        duration: '50-60 minutes',
        exercises: [
          { name: 'Romanian Deadlifts', sets: '3', reps: '10', rest: '90s' },
          { name: 'Push-ups', sets: '3', reps: '10-15', rest: '75s' },
          { name: 'Lat Pulldowns', sets: '3', reps: '12', rest: '90s' },
          { name: 'Dumbbell Lunges', sets: '3', reps: '10/leg', rest: '75s' },
          { name: 'Dumbbell Curls', sets: '3', reps: '12', rest: '60s' },
        ],
        tips: ['Focus on the muscle being worked', 'Slow controlled reps'],
      },
      {
        day: 'Friday',
        focus: 'Full Body C',
        duration: '50-60 minutes',
        exercises: [
          { name: 'Leg Press', sets: '3', reps: '12', rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '10', rest: '90s' },
          { name: 'Cable Rows', sets: '3', reps: '12', rest: '75s' },
          { name: 'Lateral Raises', sets: '3', reps: '15', rest: '45s' },
          { name: 'Tricep Pushdowns', sets: '3', reps: '15', rest: '45s' },
        ],
        tips: ['Keep a workout log', 'Aim to add one rep or tiny bit more weight each week'],
      },
    ],
    generalNotes: [
      '3 full-body sessions per week is optimal for beginners',
      'You will gain strength quickly in the first 3 months — enjoy it',
      'Form > weight every single session',
    ],
    nutrition: [
      'Eat at a 200-300 calorie surplus',
      '1.6-2g protein per kg bodyweight',
      'Eat plenty of complex carbs for energy',
      'Don\'t fear fats — they support hormone production',
    ],
  },

  muscle_building_intermediate: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Chest & Triceps',
        duration: '60-75 minutes',
        exercises: [
          { name: 'Barbell Bench Press', sets: '4', reps: '8-10', rest: '90s', notes: 'Main compound lift' },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '10-12', rest: '75s' },
          { name: 'Cable Flyes', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Tricep Dips', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Overhead Tricep Extension', sets: '3', reps: '12', rest: '60s' },
        ],
        tips: ['Progressive overload — increase weight weekly', 'Full range of motion'],
      },
      {
        day: 'Tuesday',
        focus: 'Back & Biceps',
        duration: '60-75 minutes',
        exercises: [
          { name: 'Deadlifts', sets: '4', reps: '6-8', rest: '2 min', notes: 'Heavy compound' },
          { name: 'Pull-ups / Lat Pulldowns', sets: '4', reps: '8-12', rest: '75s' },
          { name: 'Barbell Rows', sets: '4', reps: '10-12', rest: '75s' },
          { name: 'Face Pulls', sets: '3', reps: '15', rest: '60s' },
          { name: 'Barbell Curls', sets: '4', reps: '10-12', rest: '60s' },
        ],
        tips: ['Squeeze shoulder blades on rows', 'Avoid swinging on bicep exercises'],
      },
      {
        day: 'Thursday',
        focus: 'Legs & Shoulders',
        duration: '70-80 minutes',
        exercises: [
          { name: 'Barbell Squats', sets: '4', reps: '8-10', rest: '2 min', notes: 'Main compound' },
          { name: 'Romanian Deadlifts', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Leg Press', sets: '3', reps: '12-15', rest: '75s' },
          { name: 'Leg Curls', sets: '3', reps: '12', rest: '60s' },
          { name: 'Overhead Press', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Lateral Raises', sets: '4', reps: '12-15', rest: '45s' },
        ],
        tips: ['Squat to at least parallel', 'Keep core tight on overhead movements'],
      },
      {
        day: 'Saturday',
        focus: 'Arms & Core',
        duration: '50-60 minutes',
        exercises: [
          { name: 'Close-Grip Bench Press', sets: '4', reps: '10', rest: '75s' },
          { name: 'Preacher Curls', sets: '4', reps: '12', rest: '60s' },
          { name: 'Skull Crushers', sets: '3', reps: '12', rest: '60s' },
          { name: 'Cable Curls', sets: '3', reps: '15', rest: '45s' },
          { name: 'Hanging Leg Raises', sets: '3', reps: '12-15', rest: '60s' },
        ],
        tips: ['Feel the muscle working, not just moving weight'],
      },
    ],
    generalNotes: [
      'Train 4 days per week with progressive overload',
      'Ensure adequate protein intake (1.6-2.2g/kg)',
      'Get 7-9 hours of sleep for muscle growth',
      'Track lifts to ensure progressive overload',
    ],
    nutrition: [
      '200-300 calorie surplus above maintenance',
      '1.6-2.2g protein per kg bodyweight daily',
      'Consume complex carbs around workouts',
      'Post-workout protein within 1-2 hours',
    ],
  },

  muscle_building_advanced: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Chest (Heavy)',
        duration: '75 minutes',
        exercises: [
          { name: 'Barbell Bench Press', sets: '5', reps: '5', rest: '2-3 min', notes: '85%+ 1RM' },
          { name: 'Incline Barbell Press', sets: '4', reps: '8', rest: '2 min' },
          { name: 'Weighted Dips', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Cable Flyes', sets: '4', reps: '15-20', rest: '45s', notes: 'Pump work' },
          { name: 'Pec Deck', sets: '3', reps: '20', rest: '30s' },
        ],
        tips: ['Warm up thoroughly at 50%, 70%, 85% before working sets', 'Spotter on heavy sets'],
      },
      {
        day: 'Tuesday',
        focus: 'Back (Heavy)',
        duration: '75 minutes',
        exercises: [
          { name: 'Deadlifts', sets: '5', reps: '3-5', rest: '3 min', notes: 'Max effort' },
          { name: 'Weighted Pull-ups', sets: '5', reps: '6-8', rest: '2 min' },
          { name: 'T-Bar Rows', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Meadows Rows', sets: '3', reps: '10/side', rest: '60s' },
          { name: 'Straight-Arm Pulldowns', sets: '3', reps: '15', rest: '45s' },
        ],
        tips: ['Deadlift first when CNS is fresh'],
      },
      {
        day: 'Wednesday',
        focus: 'Legs (Quad Dominant)',
        duration: '80 minutes',
        exercises: [
          { name: 'Barbell Back Squats', sets: '5', reps: '5', rest: '3 min', notes: 'Heavy' },
          { name: 'Hack Squats', sets: '4', reps: '10', rest: '2 min' },
          { name: 'Leg Extensions', sets: '4', reps: '15', rest: '60s' },
          { name: 'Walking Lunges', sets: '3', reps: '15/leg', rest: '90s' },
          { name: 'Seated Calf Raises', sets: '5', reps: '15', rest: '45s' },
        ],
        tips: ['Drive knees out on squats', 'Full range on leg extensions'],
      },
      {
        day: 'Friday',
        focus: 'Shoulders & Triceps',
        duration: '70 minutes',
        exercises: [
          { name: 'Seated Barbell Overhead Press', sets: '5', reps: '5-6', rest: '2 min' },
          { name: 'Dumbbell Lateral Raises', sets: '5', reps: '12-15', rest: '45s' },
          { name: 'Rear Delt Flyes', sets: '4', reps: '15-20', rest: '45s' },
          { name: 'Overhead Tricep Extension (EZ Bar)', sets: '4', reps: '10', rest: '75s' },
          { name: 'Tricep Dips', sets: '3', reps: 'to failure', rest: '90s' },
        ],
        tips: ['Delts respond to high volume — don\'t skip lateral raises'],
      },
      {
        day: 'Saturday',
        focus: 'Legs (Posterior) & Biceps',
        duration: '70 minutes',
        exercises: [
          { name: 'Romanian Deadlifts', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Leg Curls', sets: '4', reps: '12', rest: '60s' },
          { name: 'Good Mornings', sets: '3', reps: '12', rest: '60s' },
          { name: 'Barbell Curls', sets: '4', reps: '8', rest: '75s' },
          { name: 'Incline Dumbbell Curls', sets: '3', reps: '12', rest: '60s' },
          { name: 'Hammer Curls', sets: '3', reps: '15', rest: '45s' },
        ],
        tips: ['Hamstring work is injury prevention — don\'t skip it'],
      },
    ],
    generalNotes: [
      '5-day split requires excellent recovery — sleep and nutrition are non-negotiable',
      'Deload every 4-6 weeks (50% of normal volume)',
      'Consider periodisation: 4 weeks strength → 4 weeks hypertrophy',
      'Log every session — you cannot manage what you cannot measure',
    ],
    nutrition: [
      '300-500 calorie surplus on training days',
      '2.2g protein per kg bodyweight minimum',
      'Creatine monohydrate 5g/day',
      'Post-workout: 40-50g protein + 80-100g carbs within 1 hour',
      'Prioritise whole foods; supplements fill gaps only',
    ],
  },

  // ── MAINTENANCE ──────────────────────────────────────────────────────────

  maintenance_beginner: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Full Body Strength',
        duration: '45 minutes',
        exercises: [
          { name: 'Bodyweight Squats', sets: '3', reps: '15', rest: '60s' },
          { name: 'Push-ups', sets: '3', reps: '10-15', rest: '60s' },
          { name: 'Dumbbell Rows', sets: '3', reps: '12/side', rest: '60s' },
          { name: 'Glute Bridges', sets: '3', reps: '15', rest: '45s' },
          { name: 'Plank', sets: '3', reps: '30s', rest: '30s' },
        ],
        tips: ['Consistency over intensity', 'Focus on feeling strong'],
      },
      {
        day: 'Wednesday',
        focus: 'Cardio & Flexibility',
        duration: '40 minutes',
        exercises: [
          { name: 'Brisk Walk or Light Jog', sets: '1', reps: '20 min', rest: '-' },
          { name: 'Dynamic Stretching Routine', sets: '1', reps: '10 min', rest: '-' },
          { name: 'Yoga / Mobility Sequence', sets: '1', reps: '10 min', rest: '-' },
        ],
        tips: ['Cardio supports heart health and energy levels'],
      },
      {
        day: 'Friday',
        focus: 'Full Body Strength B',
        duration: '45 minutes',
        exercises: [
          { name: 'Dumbbell Lunges', sets: '3', reps: '10/leg', rest: '60s' },
          { name: 'Dumbbell Press', sets: '3', reps: '10', rest: '60s' },
          { name: 'Lat Pulldowns', sets: '3', reps: '12', rest: '60s' },
          { name: 'Shoulder Press', sets: '3', reps: '12', rest: '60s' },
          { name: 'Dead Bug', sets: '3', reps: '10/side', rest: '45s' },
        ],
        tips: ['Maintain variety to stay motivated', 'Enjoy the process'],
      },
    ],
    generalNotes: [
      'Maintenance = keeping what you have — don\'t need to push as hard',
      '3 sessions per week is plenty',
      'Add light activity on off-days (walks, bike rides)',
    ],
    nutrition: [
      'Eat at maintenance calories — neither deficit nor surplus',
      '1.4-1.6g protein per kg bodyweight',
      'Balance all macros — no extreme restriction needed',
      'Focus on whole foods and micronutrients',
    ],
  },

  maintenance_intermediate: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Upper Body',
        duration: '55 minutes',
        exercises: [
          { name: 'Bench Press', sets: '4', reps: '8-10', rest: '75s' },
          { name: 'Pull-ups / Lat Pulldowns', sets: '4', reps: '8-10', rest: '75s' },
          { name: 'Overhead Press', sets: '3', reps: '10', rest: '75s' },
          { name: 'Cable Rows', sets: '3', reps: '12', rest: '60s' },
          { name: 'Dips', sets: '3', reps: '10-12', rest: '60s' },
        ],
        tips: ['Maintain strength — use weights you\'re comfortable with'],
      },
      {
        day: 'Wednesday',
        focus: 'Lower Body',
        duration: '55 minutes',
        exercises: [
          { name: 'Barbell Squats', sets: '4', reps: '8', rest: '90s' },
          { name: 'Romanian Deadlifts', sets: '3', reps: '10', rest: '75s' },
          { name: 'Leg Press', sets: '3', reps: '12', rest: '60s' },
          { name: 'Calf Raises', sets: '4', reps: '20', rest: '30s' },
        ],
        tips: ['Don\'t neglect legs — they\'re half your body'],
      },
      {
        day: 'Friday',
        focus: 'Full Body + Cardio',
        duration: '60 minutes',
        exercises: [
          { name: 'Deadlifts', sets: '3', reps: '6', rest: '2 min' },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '10', rest: '75s' },
          { name: 'Dumbbell Rows', sets: '3', reps: '10/side', rest: '60s' },
          { name: 'Treadmill Run', sets: '1', reps: '20 min', rest: '-', notes: 'Moderate pace' },
        ],
        tips: ['Strength + cardio in one session keeps things efficient'],
      },
    ],
    generalNotes: [
      'Maintenance means staying consistent without extreme effort',
      'Include one fun physical activity per week (sport, hiking)',
      'Deload every 6-8 weeks if feeling run down',
    ],
    nutrition: [
      'Eat at maintenance calories',
      '1.6g protein per kg bodyweight',
      'Don\'t overthink it — consistency beats perfection',
    ],
  },

  maintenance_advanced: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Push',
        duration: '65 minutes',
        exercises: [
          { name: 'Barbell Bench Press', sets: '4', reps: '6-8', rest: '2 min' },
          { name: 'Overhead Press', sets: '4', reps: '8', rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: '3', reps: '10', rest: '75s' },
          { name: 'Lateral Raises', sets: '4', reps: '15', rest: '45s' },
          { name: 'Tricep Dips', sets: '3', reps: '12', rest: '60s' },
        ],
        tips: ['Maintain your numbers — these should feel manageable'],
      },
      {
        day: 'Tuesday',
        focus: 'Pull',
        duration: '65 minutes',
        exercises: [
          { name: 'Weighted Pull-ups', sets: '4', reps: '6-8', rest: '2 min' },
          { name: 'Barbell Rows', sets: '4', reps: '8', rest: '90s' },
          { name: 'Cable Rows', sets: '3', reps: '12', rest: '60s' },
          { name: 'Face Pulls', sets: '3', reps: '20', rest: '45s' },
          { name: 'Barbell Curls', sets: '3', reps: '10', rest: '60s' },
        ],
        tips: ['Rear delts and face pulls protect shoulder health long-term'],
      },
      {
        day: 'Thursday',
        focus: 'Legs',
        duration: '65 minutes',
        exercises: [
          { name: 'Barbell Squats', sets: '4', reps: '6-8', rest: '2 min' },
          { name: 'Romanian Deadlifts', sets: '4', reps: '10', rest: '90s' },
          { name: 'Leg Press', sets: '3', reps: '12', rest: '75s' },
          { name: 'Leg Curls', sets: '3', reps: '12', rest: '60s' },
          { name: 'Standing Calf Raises', sets: '4', reps: '15', rest: '45s' },
        ],
        tips: ['Squat form is a skill — maintain it'],
      },
      {
        day: 'Saturday',
        focus: 'Full Body + Cardio',
        duration: '60 minutes',
        exercises: [
          { name: 'Deadlifts', sets: '3', reps: '5', rest: '2 min', notes: 'Moderate load' },
          { name: 'Dumbbell Press', sets: '3', reps: '10', rest: '75s' },
          { name: 'Lat Pulldowns', sets: '3', reps: '12', rest: '60s' },
          { name: 'Zone 2 Cardio', sets: '1', reps: '20 min', rest: '-', notes: 'Conversational pace' },
        ],
        tips: ['Zone 2 cardio is excellent for long-term cardiovascular health'],
      },
    ],
    generalNotes: [
      'At advanced level, maintenance is about longevity — train smart, not just hard',
      'Prioritise sleep and stress management',
      'Annual deload phases (1-2 weeks full rest) are worthwhile',
    ],
    nutrition: [
      'Eat at maintenance — you know your body at this point',
      '1.8-2g protein per kg bodyweight',
      'Avoid long periods of restriction or excessive surplus',
    ],
  },

  // ── WEIGHT GAIN ──────────────────────────────────────────────────────────

  weight_gain_beginner: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Full Body (Strength Focus)',
        duration: '55 minutes',
        exercises: [
          { name: 'Barbell Squats (or Goblet Squats)', sets: '4', reps: '8', rest: '2 min' },
          { name: 'Dumbbell Bench Press', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Dumbbell Rows', sets: '4', reps: '10/side', rest: '90s' },
          { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10', rest: '75s' },
          { name: 'Plank', sets: '3', reps: '30s', rest: '45s' },
        ],
        tips: ['Compound movements = most muscle stimulated = most growth signal'],
      },
      {
        day: 'Wednesday',
        focus: 'Full Body B',
        duration: '55 minutes',
        exercises: [
          { name: 'Romanian Deadlifts', sets: '4', reps: '8', rest: '2 min' },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '10', rest: '90s' },
          { name: 'Lat Pulldowns', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Dumbbell Lunges', sets: '3', reps: '10/leg', rest: '75s' },
          { name: 'Bicep Curls', sets: '3', reps: '12', rest: '60s' },
        ],
        tips: ['Aim to add small amounts of weight each week'],
      },
      {
        day: 'Friday',
        focus: 'Full Body C',
        duration: '55 minutes',
        exercises: [
          { name: 'Leg Press', sets: '4', reps: '10', rest: '90s' },
          { name: 'Cable Rows', sets: '4', reps: '12', rest: '75s' },
          { name: 'Dips (assisted if needed)', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Lateral Raises', sets: '3', reps: '15', rest: '45s' },
          { name: 'Tricep Pushdowns', sets: '3', reps: '15', rest: '45s' },
        ],
        tips: ['Limit cardio — it burns calories you need for growth'],
      },
    ],
    generalNotes: [
      'Weight gain for beginners is fast — milk this phase',
      'Keep cardio to minimum (1 light session/week max)',
      'Sleep 8-9 hours — most growth happens during sleep',
    ],
    nutrition: [
      '400-500 calorie surplus every day',
      '1.6-2g protein per kg bodyweight',
      'Eat every 3-4 hours — don\'t let yourself get hungry',
      'Calorie-dense foods: nuts, nut butters, avocado, whole milk, oats, rice',
      'Liquid calories (smoothies, shakes) help if eating feels like a chore',
    ],
  },

  weight_gain_intermediate: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Chest & Triceps (Volume)',
        duration: '70 minutes',
        exercises: [
          { name: 'Barbell Bench Press', sets: '5', reps: '8-10', rest: '90s' },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '10-12', rest: '75s' },
          { name: 'Cable Flyes', sets: '4', reps: '15', rest: '60s' },
          { name: 'Overhead Tricep Extension', sets: '4', reps: '12', rest: '60s' },
          { name: 'Tricep Rope Pushdowns', sets: '3', reps: '15', rest: '45s' },
        ],
        tips: ['High volume = maximum growth stimulus'],
      },
      {
        day: 'Tuesday',
        focus: 'Back & Biceps (Volume)',
        duration: '70 minutes',
        exercises: [
          { name: 'Pull-ups', sets: '4', reps: '8-12', rest: '90s' },
          { name: 'Barbell Rows', sets: '4', reps: '10', rest: '90s' },
          { name: 'Seated Cable Rows', sets: '4', reps: '12', rest: '75s' },
          { name: 'Barbell Curls', sets: '4', reps: '10', rest: '60s' },
          { name: 'Hammer Curls', sets: '3', reps: '12', rest: '45s' },
        ],
        tips: ['Back responds to variety — mix grips and angles'],
      },
      {
        day: 'Thursday',
        focus: 'Legs (Volume)',
        duration: '75 minutes',
        exercises: [
          { name: 'Barbell Squats', sets: '5', reps: '10', rest: '2 min' },
          { name: 'Romanian Deadlifts', sets: '4', reps: '12', rest: '90s' },
          { name: 'Leg Press', sets: '4', reps: '15', rest: '90s' },
          { name: 'Leg Curls', sets: '4', reps: '12', rest: '60s' },
          { name: 'Standing Calf Raises', sets: '5', reps: '15', rest: '45s' },
        ],
        tips: ['Leg training drives the most systemic anabolic response'],
      },
      {
        day: 'Saturday',
        focus: 'Shoulders & Arms (Volume)',
        duration: '65 minutes',
        exercises: [
          { name: 'Overhead Press', sets: '4', reps: '10', rest: '90s' },
          { name: 'Lateral Raises', sets: '5', reps: '15', rest: '45s' },
          { name: 'Rear Delt Flyes', sets: '4', reps: '15', rest: '45s' },
          { name: 'Skull Crushers', sets: '4', reps: '12', rest: '60s' },
          { name: 'Preacher Curls', sets: '4', reps: '12', rest: '60s' },
        ],
        tips: ['Arms grow best when the big lifts are already progressing'],
      },
    ],
    generalNotes: [
      'High volume 4-day split — requires consistent nutrition to recover',
      'Track lifts and bodyweight weekly',
      'Expect 0.25-0.5kg of weight gain per week on a good surplus',
    ],
    nutrition: [
      '400-600 calorie surplus',
      '2g protein per kg bodyweight',
      'Carb-heavy meals around training — rice, pasta, potatoes',
      'Pre-bed protein snack: cottage cheese, Greek yoghurt, casein shake',
    ],
  },

  weight_gain_advanced: {
    weeklyPlan: [
      {
        day: 'Monday',
        focus: 'Heavy Push',
        duration: '80 minutes',
        exercises: [
          { name: 'Barbell Bench Press', sets: '6', reps: '4-6', rest: '3 min', notes: '88-92% 1RM' },
          { name: 'Incline Barbell Press', sets: '4', reps: '8', rest: '2 min' },
          { name: 'Dumbbell Flyes', sets: '4', reps: '15', rest: '60s' },
          { name: 'Seated Overhead Press', sets: '4', reps: '8', rest: '90s' },
          { name: 'Skull Crushers', sets: '4', reps: '10', rest: '75s' },
        ],
        tips: ['Progressively overload the bench — it\'s the key mass builder'],
      },
      {
        day: 'Tuesday',
        focus: 'Heavy Pull',
        duration: '80 minutes',
        exercises: [
          { name: 'Deadlifts', sets: '6', reps: '3-5', rest: '3-4 min', notes: 'Near-maximal' },
          { name: 'Weighted Pull-ups', sets: '5', reps: '6-8', rest: '2 min' },
          { name: 'Barbell Rows', sets: '5', reps: '6-8', rest: '2 min' },
          { name: 'Cable Rows', sets: '3', reps: '15', rest: '60s', notes: 'Pump set' },
          { name: 'EZ Bar Curls', sets: '4', reps: '8', rest: '75s' },
        ],
        tips: ['Deadlifts drive systemic growth like nothing else — protect your back with good form'],
      },
      {
        day: 'Wednesday',
        focus: 'Legs (Quad)',
        duration: '80 minutes',
        exercises: [
          { name: 'Barbell Squats', sets: '6', reps: '4-6', rest: '3 min', notes: '88-92% 1RM' },
          { name: 'Hack Squats', sets: '4', reps: '10', rest: '2 min' },
          { name: 'Leg Extensions', sets: '4', reps: '15', rest: '60s' },
          { name: 'Walking Lunges', sets: '3', reps: '15/leg', rest: '90s' },
          { name: 'Standing Calf Raises', sets: '6', reps: '12', rest: '45s' },
        ],
        tips: ['Heavy squats + high volume legs = the biggest growth stimulus possible'],
      },
      {
        day: 'Friday',
        focus: 'Volume Push',
        duration: '75 minutes',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: '5', reps: '12', rest: '90s' },
          { name: 'Lateral Raises', sets: '5', reps: '20', rest: '30s' },
          { name: 'Cable Flyes', sets: '4', reps: '20', rest: '30s' },
          { name: 'Overhead Tricep Extension', sets: '4', reps: '12', rest: '60s' },
          { name: 'Tricep Dips', sets: '4', reps: '15', rest: '60s' },
        ],
        tips: ['Volume day — lighter weight, higher reps, chase the pump'],
      },
      {
        day: 'Saturday',
        focus: 'Legs (Posterior) & Volume Pull',
        duration: '75 minutes',
        exercises: [
          { name: 'Romanian Deadlifts', sets: '5', reps: '10', rest: '90s' },
          { name: 'Leg Curls', sets: '5', reps: '12', rest: '60s' },
          { name: 'Lat Pulldowns', sets: '4', reps: '15', rest: '60s' },
          { name: 'Dumbbell Rows', sets: '4', reps: '15/side', rest: '60s' },
          { name: 'Incline Dumbbell Curls', sets: '4', reps: '12', rest: '60s' },
        ],
        tips: ['Volume and pump work — focus on muscle contraction'],
      },
    ],
    generalNotes: [
      '5-day advanced split — recovery is the limiting factor',
      'Deload every 4-5 weeks: halve volume, maintain intensity',
      'Advanced lifters must periodise — linear progression is over',
      'Track every session; small PRs still count',
    ],
    nutrition: [
      '500+ calorie surplus',
      '2.2g protein per kg bodyweight minimum',
      'Mass-gain phases work best in 3-4 month blocks before a cut',
      'Creatine, sleep, and food are the only supplements that reliably matter',
      'Don\'t let body fat exceed 18-20% — start a mini-cut before continuing',
    ],
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateWorkoutRoutine(
  goal: string,
  experienceLevel: string,
  gender: 'male' | 'female' | 'other',
  age: number,
  bmiCategory: string
): WorkoutRoutine {
  const key = `${goal}_${experienceLevel}`;
  const template = TEMPLATES[key] ?? fallback(goal);
  return customizeRoutine(JSON.parse(JSON.stringify(template)), age, bmiCategory, gender);
}

function fallback(goal: string): WorkoutRoutine {
  if (goal === 'weight_loss') return TEMPLATES.weight_loss_beginner;
  if (goal === 'weight_gain') return TEMPLATES.weight_gain_beginner;
  if (goal === 'maintenance') return TEMPLATES.maintenance_beginner;
  return TEMPLATES.muscle_building_beginner;
}

function customizeRoutine(
  routine: WorkoutRoutine,
  age: number,
  bmiCategory: string,
  _gender: string
): WorkoutRoutine {
  if (age > 50) {
    routine.generalNotes.push(
      'Add 10-15 minutes of warm-up and cool-down',
      'Prioritise joint-friendly movements and mobility work',
      'Rest and recovery become increasingly important after 50'
    );
  }

  if (bmiCategory === 'Obese' || bmiCategory === 'Overweight') {
    routine.generalNotes.push(
      'Start with low-impact cardio to protect joints',
      'Swimming and cycling are excellent alternatives to running'
    );
  }

  if (bmiCategory === 'Underweight') {
    routine.nutrition.push(
      'Prioritise calorie-dense whole foods: nuts, avocados, whole milk',
      'Eat 5-6 smaller meals — large meals can feel overwhelming',
      'Minimise endurance cardio while in a gaining phase'
    );
  }

  return routine;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
