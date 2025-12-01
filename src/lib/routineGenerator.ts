/**
 * Personalized Workout Routine Generator
 * Generates workout plans based on user goals, experience, and BMI
 */

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

/**
 * Generate personalized workout routine
 */
export function generateWorkoutRoutine(
  goal: string,
  experienceLevel: string,
  gender: 'male' | 'female' | 'other',
  age: number,
  bmiCategory: string
): WorkoutRoutine {
  // Base routine templates
  const routines: { [key: string]: WorkoutRoutine } = {
    weight_loss_beginner: {
      weeklyPlan: [
        {
          day: 'Monday',
          focus: 'Full Body + Cardio',
          duration: '45-60 minutes',
          exercises: [
            { name: 'Treadmill Walk/Jog', sets: '1', reps: '15 min', rest: '-', notes: 'Warm-up' },
            { name: 'Bodyweight Squats', sets: '3', reps: '12-15', rest: '60s' },
            { name: 'Push-ups (Modified if needed)', sets: '3', reps: '8-12', rest: '60s' },
            { name: 'Dumbbell Rows', sets: '3', reps: '12', rest: '60s' },
            { name: 'Plank Hold', sets: '3', reps: '30s', rest: '45s' },
            { name: 'Stationary Bike', sets: '1', reps: '15 min', rest: '-', notes: 'Cool down' },
          ],
          tips: [
            'Focus on form over weight',
            'Stay hydrated throughout',
            'Listen to your body',
          ],
        },
        {
          day: 'Wednesday',
          focus: 'Cardio + Core',
          duration: '40-50 minutes',
          exercises: [
            { name: 'Elliptical', sets: '1', reps: '20 min', rest: '-', notes: 'Moderate intensity' },
            { name: 'Mountain Climbers', sets: '3', reps: '15', rest: '45s' },
            { name: 'Bicycle Crunches', sets: '3', reps: '20', rest: '45s' },
            { name: 'Russian Twists', sets: '3', reps: '15/side', rest: '45s' },
            { name: 'Walking Lunges', sets: '3', reps: '10/leg', rest: '60s' },
          ],
          tips: [
            'Maintain consistent cardio pace',
            'Engage core throughout exercises',
          ],
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
          tips: [
            'Keep rest periods short',
            'Complete all exercises in circuit',
          ],
        },
      ],
      generalNotes: [
        'Aim for 3-4 workouts per week with rest days in between',
        'Start with lighter weights and focus on proper form',
        'Gradually increase intensity as you build endurance',
        'Incorporate 30-45 minutes of moderate cardio on rest days if possible',
      ],
      nutrition: [
        'Maintain a calorie deficit of 300-500 calories per day',
        'Eat protein-rich foods after workouts (chicken, fish, eggs)',
        'Stay hydrated - drink 2-3 liters of water daily',
        'Avoid processed foods and sugary drinks',
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
            { name: 'Tricep Rope Pushdown', sets: '3', reps: '15', rest: '45s' },
          ],
          tips: [
            'Progressive overload - increase weight weekly',
            'Control the negative portion of each rep',
            'Full range of motion on all exercises',
          ],
        },
        {
          day: 'Tuesday',
          focus: 'Back & Biceps',
          duration: '60-75 minutes',
          exercises: [
            { name: 'Deadlifts', sets: '4', reps: '6-8', rest: '2 min', notes: 'Heavy compound' },
            { name: 'Pull-ups/Lat Pulldowns', sets: '4', reps: '8-12', rest: '75s' },
            { name: 'Barbell Rows', sets: '4', reps: '10-12', rest: '75s' },
            { name: 'Face Pulls', sets: '3', reps: '15', rest: '60s' },
            { name: 'Barbell Curls', sets: '4', reps: '10-12', rest: '60s' },
            { name: 'Hammer Curls', sets: '3', reps: '12', rest: '45s' },
          ],
          tips: [
            'Squeeze shoulder blades on rows',
            'Avoid swinging on bicep exercises',
          ],
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
            { name: 'Rear Delt Flyes', sets: '3', reps: '15', rest: '45s' },
          ],
          tips: [
            'Squat to at least parallel depth',
            'Keep core tight on overhead movements',
          ],
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
            { name: 'Ab Wheel Rollouts', sets: '3', reps: '10-12', rest: '60s' },
          ],
          tips: [
            'Feel the muscle working, not just moving weight',
            'Maintain tension on core exercises',
          ],
        },
      ],
      generalNotes: [
        'Train 4 days per week with progressive overload',
        'Ensure adequate protein intake (1.6-2.2g per kg body weight)',
        'Get 7-9 hours of sleep for recovery and muscle growth',
        'Consider tracking lifts to ensure progressive overload',
        'Rest 48-72 hours between training same muscle groups',
      ],
      nutrition: [
        'Caloric surplus of 200-300 calories above maintenance',
        'Prioritize protein: 1.6-2.2g per kg body weight daily',
        'Consume complex carbs around workouts',
        'Don\'t neglect healthy fats for hormone production',
        'Consider post-workout protein shake within 1-2 hours',
      ],
    },
  };

  // Select appropriate routine based on goal and experience
  let selectedRoutine: WorkoutRoutine;
  const key = `${goal}_${experienceLevel}`;

  // Check if exact match exists, otherwise use closest match
  if (routines[key]) {
    selectedRoutine = routines[key];
  } else {
    // Fallback logic
    if (goal === 'weight_loss') {
      selectedRoutine = routines.weight_loss_beginner;
    } else {
      selectedRoutine = routines.muscle_building_intermediate;
    }
  }

  // Customize based on age and BMI
  selectedRoutine = customizeRoutine(selectedRoutine, age, bmiCategory, gender);

  return selectedRoutine;
}

/**
 * Customize routine based on age and BMI
 */
function customizeRoutine(
  routine: WorkoutRoutine,
  age: number,
  bmiCategory: string,
  gender: string
): WorkoutRoutine {
  const customized = JSON.parse(JSON.stringify(routine)); // Deep clone

  // Add age-specific modifications
  if (age > 50) {
    customized.generalNotes.push(
      'Consider adding extra warm-up time (10-15 minutes)',
      'Focus on joint-friendly exercises and mobility work',
      'Prioritize recovery - consider yoga or stretching on rest days'
    );
  }

  // Add BMI-specific modifications
  if (bmiCategory === 'Obese' || bmiCategory === 'Overweight') {
    customized.generalNotes.push(
      'Start with low-impact cardio to protect joints',
      'Consider swimming or cycling as alternative cardio',
      'Focus on diet - weight loss is 70% nutrition, 30% exercise'
    );
  }

  if (bmiCategory === 'Underweight') {
    customized.nutrition.push(
      'Focus on calorie-dense foods: nuts, avocados, whole milk',
      'Eat 5-6 smaller meals throughout the day',
      'Don\'t do excessive cardio - focus on strength training'
    );
  }

  return customized;
}

/**
 * Get BMI category from BMI value
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
