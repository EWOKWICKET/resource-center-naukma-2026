import { Types } from 'mongoose';
import { UserBook } from '../types';
import { MongoDoc } from './mongo';

export type UserBookDoc = MongoDoc<UserBook, { addedAt: Date; userId: Types.ObjectId; bookId: Types.ObjectId }>;

export const toUserBook = (doc: UserBookDoc): UserBook => ({
  id: doc._id.toString(),
  userId: doc.userId.toString(),
  bookId: doc.bookId.toString(),
  addedAt: doc.addedAt.toISOString(),
});
