import { Book, BookFilters, BooksPage } from '../types';
import { BookInput } from '../schemas/books.schema';
import { booksRepository } from '../repositories/books.repository';
import { sseService } from './sse.service';

export const booksService = {
  findAll(filters: BookFilters = {}): BooksPage {
    const resolved: BookFilters = { isActive: true, ...filters };

    return booksRepository.findAll(resolved);
  },

  findById(id: string): Book {
    const book = booksRepository.findById(id);
    if (!book) throw { statusCode: 404, message: 'Book not found' };

    return book;
  },

  create(data: BookInput): Book {
    const book = booksRepository.create({ ...data, isActive: true });
    sseService.emit('book:created', { book });

    return book;
  },

  update(id: string, data: BookInput): Book {
    this.findById(id);
    const book = booksRepository.update(id, data)!;
    sseService.emit('book:updated', { book });

    return book;
  },

  delete(id: string): void {
    this.findById(id);
    booksRepository.delete(id);
    sseService.emit('book:deleted', { bookId: id });
  },

  setStatus(id: string, isActive: boolean): Book {
    this.findById(id);
    const book = booksRepository.update(id, { isActive })!;
    sseService.emit('book:statusChanged', { book });

    return book;
  },
};
