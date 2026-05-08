import mongoose, { Document, Schema } from 'mongoose';

export type CoachClientStatus = 'pending' | 'active' | 'declined' | 'ended';

export interface ICoachClient extends Document {
  coachId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  status: CoachClientStatus;
  requestedBy: 'client' | 'coach';
  message?: string;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CoachClientSchema: Schema = new Schema(
  {
    coachId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'declined', 'ended'],
      default: 'pending',
      index: true,
    },
    requestedBy: { type: String, enum: ['client', 'coach'], required: true },
    message: { type: String, maxlength: 500 },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

CoachClientSchema.index(
  { coachId: 1, clientId: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'active'] } } }
);

export default mongoose.models.CoachClient ||
  mongoose.model<ICoachClient>('CoachClient', CoachClientSchema);
