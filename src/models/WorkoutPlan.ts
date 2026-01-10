import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkoutExercise {
  exerciseId: mongoose.Types.ObjectId;
  name: string; // Denormalized for quick access
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  order: number;
}

export interface IWorkoutDay {
  day: string;
  focus: string;
  duration: string;
  exercises: IWorkoutExercise[];
  isRestDay: boolean;
}

export interface IWorkoutPlan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'ai_generated' | 'custom';
  isActive: boolean;
  weeklySchedule: IWorkoutDay[];
  generalNotes: string;
  nutritionTips: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutExerciseSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
    min: 1,
  },
  reps: {
    type: String,
    required: true,
  },
  rest: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, { _id: false });

const WorkoutDaySchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  focus: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  exercises: {
    type: [WorkoutExerciseSchema],
    default: [],
  },
  isRestDay: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const WorkoutPlanSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Workout plan name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['ai_generated', 'custom'],
      default: 'custom',
    },
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    weeklySchedule: {
      type: [WorkoutDaySchema],
      required: true,
      validate: {
        validator: function(v: IWorkoutDay[]) {
          return v && v.length > 0 && v.length <= 7;
        },
        message: 'Weekly schedule must have between 1 and 7 days',
      },
    },
    generalNotes: {
      type: String,
      default: '',
    },
    nutritionTips: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one active plan per user
WorkoutPlanSchema.index({ userId: 1, isActive: 1 });

// Pre-save middleware to ensure only one active plan per user
WorkoutPlanSchema.pre('save', async function(next) {
  if (this.isActive && this.isModified('isActive')) {
    // Deactivate all other plans for this user
    await mongoose.model('WorkoutPlan').updateMany(
      {
        userId: this.userId,
        _id: { $ne: this._id },
        isActive: true
      },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.models.WorkoutPlan || mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);
