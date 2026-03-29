import mongoose, { Schema, Types } from 'mongoose';

interface SessionModel {
  sessionId: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}

const sessionSchema = new Schema<SessionModel>({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  expiresAt: { type: Date, required: true },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = mongoose.model<SessionModel>('Session', sessionSchema);
