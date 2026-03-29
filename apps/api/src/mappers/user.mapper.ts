import { User } from '../types';
import { MongoDoc } from './mongo';

// Extends the mapped type with passwordHash (present in DB, excluded from User interface)
export type UserDoc = MongoDoc<User, { createdAt: Date; updatedAt: Date }> & {
  passwordHash: string;
  expiresAt?: Date;
};

export const toUser = (doc: UserDoc): User => ({
  id: doc._id.toString(),
  email: doc.email,
  firstName: doc.firstName,
  lastName: doc.lastName,
  bio: doc.bio,
  role: doc.role,
  isVerified: doc.isVerified,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});
