/**
 * Fitness calculation utilities
 */

export interface BMIResult {
  bmi: number;
  category: string;
  healthy: boolean;
}

export interface CalorieResult {
  bmr: number;
  maintenance: number;
  weightLoss: number;
  weightGain: number;
}

export interface MacroResult {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
}

/**
 * Calculate BMI (Body Mass Index)
 * @param weight - Weight in kg
 * @param height - Height in cm
 */
export function calculateBMI(weight: number, height: number): BMIResult {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category = '';
  let healthy = false;

  if (bmi < 18.5) {
    category = 'Underweight';
    healthy = false;
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
    healthy = true;
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    healthy = false;
  } else {
    category = 'Obese';
    healthy = false;
  }

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    healthy,
  };
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param weight - Weight in kg
 * @param height - Height in cm
 * @param age - Age in years
 * @param gender - 'male' or 'female'
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  let bmr: number;

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // For 'female' and 'other'
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  return Math.round(bmr);
}

/**
 * Calculate maintenance calories based on activity level
 * @param bmr - Basal Metabolic Rate
 * @param lifestyle - Activity level
 */
export function calculateMaintenanceCalories(
  bmr: number,
  lifestyle: string
): number {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };

  const multiplier = activityMultipliers[lifestyle] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate calorie targets based on goal
 */
export function calculateCalorieTargets(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  lifestyle: string
): CalorieResult {
  const bmr = calculateBMR(weight, height, age, gender);
  const maintenance = calculateMaintenanceCalories(bmr, lifestyle);

  // For weight loss: 15-20% calorie deficit
  const weightLoss = Math.round(maintenance * 0.85);

  // For weight gain: 10-15% calorie surplus
  const weightGain = Math.round(maintenance * 1.15);

  return {
    bmr,
    maintenance,
    weightLoss,
    weightGain,
  };
}

/**
 * Calculate macronutrient targets
 * @param calories - Target calories
 * @param goal - Fitness goal
 */
export function calculateMacros(
  calories: number,
  goal: string
): MacroResult {
  let proteinPercentage = 0.3;
  let carbsPercentage = 0.4;
  let fatsPercentage = 0.3;

  // Adjust macros based on goal
  switch (goal) {
    case 'weight_loss':
      proteinPercentage = 0.35;
      carbsPercentage = 0.35;
      fatsPercentage = 0.3;
      break;
    case 'muscle_building':
      proteinPercentage = 0.35;
      carbsPercentage = 0.45;
      fatsPercentage = 0.2;
      break;
    case 'weight_gain':
      proteinPercentage = 0.3;
      carbsPercentage = 0.5;
      fatsPercentage = 0.2;
      break;
    default: // maintenance
      proteinPercentage = 0.3;
      carbsPercentage = 0.4;
      fatsPercentage = 0.3;
  }

  // Protein and carbs: 4 calories per gram
  // Fats: 9 calories per gram
  const protein = Math.round((calories * proteinPercentage) / 4);
  const carbs = Math.round((calories * carbsPercentage) / 4);
  const fats = Math.round((calories * fatsPercentage) / 9);

  return { protein, carbs, fats };
}

/**
 * Calculate daily water intake recommendation
 * @param weight - Weight in kg
 */
export function calculateWaterIntake(weight: number): number {
  // Basic formula: 30-35ml per kg of body weight
  return Math.round(weight * 0.033); // Returns liters
}
