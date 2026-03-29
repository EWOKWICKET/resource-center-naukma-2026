import { UserBookModel } from '../models/user-book.model';
import { UserBookDoc, toUserBook } from '../mappers/user-book.mapper';
import { UserBook } from '../types';

export const userBooksRepository = {
  async findByUserId(userId: string): Promise<UserBook[]> {
    const docs = await UserBookModel.find({ userId }).lean<UserBookDoc[]>();

    return docs.map(toUserBook);
  },

  async findOne(userId: string, bookId: string): Promise<UserBook | null> {
    const doc = await UserBookModel.findOne({ userId, bookId }).lean<UserBookDoc>();

    return doc ? toUserBook(doc) : null;
  },

  async create(userId: string, bookId: string): Promise<UserBook> {
    const doc = await UserBookModel.create({ userId, bookId });

    return toUserBook(doc.toObject() as unknown as UserBookDoc);
  },

  async delete(userId: string, bookId: string): Promise<void> {
    await UserBookModel.deleteOne({ userId, bookId });
  },
};
