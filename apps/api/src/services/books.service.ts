import { Book, BookFilters } from '../types';
import { BookInput } from '../schemas/books.schema';
import { booksRepository } from '../repositories/books.repository';
import { sseService } from './sse.service';

export const booksService = {
  async findAll(filters: BookFilters = {}): Promise<Book[]> {
    const resolved: BookFilters = { isActive: true, ...filters };

    return booksRepository.findAll(resolved);
  },

  async findById(id: string): Promise<Book> {
    const book = await booksRepository.findById(id);
    if (!book) throw { statusCode: 404, message: 'Book not found' };

    return book;
  },

  async create(data: BookInput): Promise<Book> {
    const book = await booksRepository.create({ ...data, isActive: true });
    sseService.emit('book:created', { book });

    return book;
  },

  async update(id: string, data: BookInput): Promise<Book> {
    await this.findById(id);
    const book = (await booksRepository.update(id, data))!;
    sseService.emit('book:updated', { book });

    return book;
  },

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await booksRepository.delete(id);
    sseService.emit('book:deleted', { bookId: id });
  },

  async setStatus(id: string, isActive: boolean): Promise<Book> {
    await this.findById(id);
    const book = (await booksRepository.update(id, { isActive }))!;
    sseService.emit('book:statusChanged', { book });

    return book;
  },
};
