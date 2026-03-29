import { BookModel } from '../models/book.model';
import { BookDoc, toBook } from '../mappers/book.mapper';
import { Book, BookFilters } from '../types';

export const booksRepository = {
  async findAll(filters: BookFilters = {}): Promise<Book[]> {
    const query: Record<string, unknown> = {};

    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.genre) query.genres = filters.genre;
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      query.$or = [{ title: regex }, { authors: regex }];
    }

    const docs = await BookModel.find(query).lean<BookDoc[]>();

    return docs.map(toBook);
  },

  async findById(id: string): Promise<Book | null> {
    const doc = await BookModel.findById(id).lean<BookDoc>();

    return doc ? toBook(doc) : null;
  },

  async countByStatus(): Promise<{ total: number; active: number; inactive: number }> {
    const [total, active] = await Promise.all([BookModel.countDocuments(), BookModel.countDocuments({ isActive: true })]);

    return { total, active, inactive: total - active };
  },

  async create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const doc = await BookModel.create(data);

    return toBook(doc.toObject() as unknown as BookDoc);
  },

  async update(id: string, data: Partial<Omit<Book, 'id' | 'createdAt'>>): Promise<Book | null> {
    const doc = await BookModel.findByIdAndUpdate(id, data, { new: true }).lean<BookDoc>();

    return doc ? toBook(doc) : null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await BookModel.findByIdAndDelete(id);

    return result !== null;
  },
};
