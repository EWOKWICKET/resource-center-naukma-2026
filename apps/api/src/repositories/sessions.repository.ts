import crypto from 'crypto';
import { SessionModel } from '../models/session.model';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const sessionsRepository = {
  async create(userId: string): Promise<string> {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await SessionModel.create({ sessionId, userId, expiresAt });

    return sessionId;
  },

  async findBySessionId(sessionId: string): Promise<{ userId: string; expiresAt: Date } | null> {
    const doc = await SessionModel.findOne({ sessionId, expiresAt: { $gt: new Date() } }).lean();
    if (!doc) return null;

    return { userId: doc.userId.toString(), expiresAt: doc.expiresAt };
  },

  async delete(sessionId: string): Promise<void> {
    await SessionModel.deleteOne({ sessionId });
  },
};
