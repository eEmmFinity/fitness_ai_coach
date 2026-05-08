import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkoutSession extends Document {
  userId: mongoose.Types.ObjectId;
  exerciseType: 'squat' | 'pushup' | 'plank';
  repCount: number;
  formScore: number;
  caloriesBurned: number;
  duration: number;
  tempo: number;
  createdAt: Date;
}

const WorkoutSessionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exerciseType: {
      type: String,
      required: true,
      enum: ['squat', 'pushup', 'plank'],
    },
    repCount: { type: Number, required: true, min: 0 },
    formScore: { type: Number, required: true, min: 0, max: 100 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 0 },
    tempo: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.WorkoutSession ||
  mongoose.model<IWorkoutSession>('WorkoutSession', WorkoutSessionSchema);
