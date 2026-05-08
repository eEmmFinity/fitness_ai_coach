import mongoose, { Document, Schema } from 'mongoose';

export type AuditAction =
  | 'user.role_changed'
  | 'user.suspended'
  | 'user.unsuspended'
  | 'user.deleted';

export interface IAuditLog extends Document {
  actorId: mongoose.Types.ObjectId;
  action: AuditAction;
  targetType: 'user' | 'exercise' | 'workoutPlan';
  targetId: mongoose.Types.ObjectId;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
