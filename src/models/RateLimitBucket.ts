import mongoose, { Document, Schema } from 'mongoose';

export interface IRateLimitBucket extends Document {
  key: string;
  count: number;
  windowStart: Date;
  expiresAt: Date;
}

const RateLimitBucketSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    windowStart: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

// Mongo deletes documents after expiresAt — automatic cleanup.
RateLimitBucketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimitBucket ||
  mongoose.model<IRateLimitBucket>('RateLimitBucket', RateLimitBucketSchema);
