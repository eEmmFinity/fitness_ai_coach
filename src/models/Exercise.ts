import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  imageUrl?: string;
  caloriesPerRep: number;
  isCustom: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['strength', 'cardio', 'flexibility', 'sports'],
      index: true,
    },
    muscleGroups: {
      type: [String],
      required: true,
      index: true,
    },
    equipment: {
      type: [String],
      required: true,
      default: ['none'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: [String],
      default: [],
    },
    tips: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    caloriesPerRep: {
      type: Number,
      default: 1,
      min: 0,
    },
    isCustom: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for efficient filtering
ExerciseSchema.index({ category: 1, difficulty: 1 });
ExerciseSchema.index({ muscleGroups: 1, equipment: 1 });
ExerciseSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', ExerciseSchema);
