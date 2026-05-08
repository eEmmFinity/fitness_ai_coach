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

export type UserRole = 'user' | 'coach' | 'admin' | 'pending_coach';

export interface CoachApplication {
  status: 'pending' | 'approved' | 'rejected';
  bio?: string;
  appliedAt: Date;
  decidedAt?: Date | null;
  decidedBy?: mongoose.Types.ObjectId | null;
  rejectionReason?: string | null;
}

export interface CoachProfile {
  bio?: string;
  approvedAt?: Date | null;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  coachApplication?: CoachApplication | null;
  coachProfile?: CoachProfile | null;
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
  suspendedAt?: Date | null;
  emailVerified: boolean;
  subscription: {
    tier: 'free' | 'pro';
    status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'none';
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    currentPeriodEnd?: Date | null;
  };
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
    role: {
      type: String,
      enum: ['user', 'coach', 'admin', 'pending_coach'],
      default: 'user',
      required: true,
      index: true,
    },
    coachApplication: {
      type: {
        status: { type: String, enum: ['pending', 'approved', 'rejected'] },
        bio: { type: String, maxlength: 1000 },
        appliedAt: { type: Date },
        decidedAt: { type: Date, default: null },
        decidedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        rejectionReason: { type: String, default: null, maxlength: 500 },
      },
      default: null,
    },
    coachProfile: {
      type: {
        bio: { type: String, maxlength: 1000 },
        approvedAt: { type: Date, default: null },
      },
      default: null,
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
    suspendedAt: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    subscription: {
      tier: { type: String, enum: ['free', 'pro'], default: 'free' },
      status: {
        type: String,
        enum: ['active', 'past_due', 'canceled', 'incomplete', 'none'],
        default: 'none',
      },
      stripeCustomerId: { type: String, default: null, index: true },
      stripeSubscriptionId: { type: String, default: null },
      currentPeriodEnd: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
