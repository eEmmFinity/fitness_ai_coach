import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  // The (coachId, clientId) pair identifies the thread. Either one can be the sender.
  coachId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  fromId: mongoose.Types.ObjectId; // sender — coachId or clientId
  toId: mongoose.Types.ObjectId; // recipient — the other one
  body: string;
  readAt?: Date | null;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    coachId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fromId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    toId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true, maxlength: 4000 },
    readAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Common queries: thread by (coach, client) sorted by time, unread by recipient
MessageSchema.index({ coachId: 1, clientId: 1, createdAt: -1 });
MessageSchema.index({ toId: 1, readAt: 1 });

export default mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema);
