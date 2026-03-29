import mongoose, { Schema, Types } from 'mongoose';

interface UserBookModel {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  addedAt: Date;
}

const userBookSchema = new Schema<UserBookModel>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  bookId: { type: Schema.Types.ObjectId, required: true, ref: 'Book' },
  addedAt: { type: Date, required: true, default: Date.now },
});

userBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const UserBookModel = mongoose.model<UserBookModel>('UserBook', userBookSchema);
