import mongoose, { Document, Schema } from 'mongoose';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  weeklySchedule: WorkoutDay[];
  generalNotes: string;
  nutritionTips: string;
  createdAt?: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  goal?: 'weight_loss' | 'weight_gain' | 'maintenance' | 'muscle_building';
  lifestyle?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  bmi?: number;
  bmr?: number;
  maintenanceCalories?: number;
  workoutPlan?: WorkoutPlan; // Legacy field for backward compatibility
  workoutPlans?: mongoose.Types.ObjectId[]; // NEW: Array of WorkoutPlan references
  activeWorkoutPlanId?: mongoose.Types.ObjectId; // NEW: Currently active plan
  customExercises?: mongoose.Types.ObjectId[]; // NEW: User's custom exercises
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age must be less than 120'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: {
      type: Number,
      min: [50, 'Height must be at least 50cm'],
      max: [300, 'Height must be less than 300cm'],
    },
    weight: {
      type: Number,
      min: [20, 'Weight must be at least 20kg'],
      max: [500, 'Weight must be less than 500kg'],
    },
    goal: {
      type: String,
      enum: ['weight_loss', 'weight_gain', 'maintenance', 'muscle_building'],
    },
    lifestyle: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    bmi: {
      type: Number,
    },
    bmr: {
      type: Number,
    },
    maintenanceCalories: {
      type: Number,
    },
    workoutPlan: {
      type: {
        weeklySchedule: [{
          day: String,
          focus: String,
          duration: String,
          exercises: [{
            name: String,
            sets: Number,
            reps: String,
            rest: String,
            notes: String,
          }],
        }],
        generalNotes: String,
        nutritionTips: String,
        createdAt: Date,
      },
      required: false,
    },
    workoutPlans: [{
      type: Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    }],
    activeWorkoutPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    },
    customExercises: [{
      type: Schema.Types.ObjectId,
      ref: 'Exercise',
    }],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
