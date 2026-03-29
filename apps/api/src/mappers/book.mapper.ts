import { Book } from '../types';
import { Genre } from '../enums/genre.enum';
import { Language } from '../enums/language.enum';
import { MongoDoc } from './mongo';

// Override genres and language to reflect actual DB storage (plain strings)
export type BookDoc = MongoDoc<Book, { createdAt: Date; updatedAt: Date; genres: string[]; language?: string }>;

export const toBook = (doc: BookDoc): Book => ({
  id: doc._id.toString(),
  title: doc.title,
  authors: doc.authors,
  genres: doc.genres as Genre[],
  description: doc.description,
  isbn: doc.isbn,
  publishedYear: doc.publishedYear,
  publisher: doc.publisher,
  language: doc.language as Language | undefined,
  pageCount: doc.pageCount,
  isActive: doc.isActive,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});
