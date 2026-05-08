import mongoose, { Document, Schema } from 'mongoose';

export type VerificationPurpose = 'email_verify' | 'password_reset';

export interface IVerificationToken extends Document {
  userId: mongoose.Types.ObjectId;
  purpose: VerificationPurpose;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}

const VerificationTokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    purpose: {
      type: String,
      enum: ['email_verify', 'password_reset'],
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Mongo TTL: docs deleted after expiresAt
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);
