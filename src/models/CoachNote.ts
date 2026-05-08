import mongoose, { Document, Schema } from 'mongoose';

export interface ICoachNote extends Document {
  coachId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId | null;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoachNoteSchema: Schema = new Schema(
  {
    coachId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'WorkoutSession', default: null },
    body: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true }
);

CoachNoteSchema.index({ coachId: 1, clientId: 1, createdAt: -1 });

export default mongoose.models.CoachNote ||
  mongoose.model<ICoachNote>('CoachNote', CoachNoteSchema);
