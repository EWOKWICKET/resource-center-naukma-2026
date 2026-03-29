import { Book } from '../types';
import { MongoDoc } from './mongo';

export type BookDoc = MongoDoc<Book, { createdAt: Date; updatedAt: Date }>;

export const toBook = (doc: BookDoc): Book => ({
  id: doc._id.toString(),
  title: doc.title,
  author: doc.author,
  description: doc.description,
  isbn: doc.isbn,
  coverUrl: doc.coverUrl,
  categoryId: doc.categoryId,
  publishedYear: doc.publishedYear,
  isActive: doc.isActive,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});
