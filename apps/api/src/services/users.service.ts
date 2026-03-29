import { usersRepository } from '../repositories/users.repository';
import { userBooksRepository } from '../repositories/user-books.repository';
import { booksRepository } from '../repositories/books.repository';
import { User, UserBook } from '../types';
import { UpdateProfileInput } from '../schemas/users.schema';

export const usersService = {
  async findById(id: string): Promise<User> {
    const user = await usersRepository.findById(id);
    if (!user) throw { statusCode: 404, message: 'User not found' };

    return user;
  },

  async update(id: string, data: UpdateProfileInput): Promise<User> {
    await this.findById(id);
    const user = await usersRepository.update(id, data);
    if (!user) throw { statusCode: 404, message: 'User not found' };

    return user;
  },

  async getLibrary(userId: string): Promise<UserBook[]> {
    return userBooksRepository.findByUserId(userId);
  },

  async addToLibrary(userId: string, bookId: string): Promise<UserBook> {
    const book = await booksRepository.findById(bookId);
    if (!book) throw { statusCode: 404, message: 'Book not found' };

    const existing = await userBooksRepository.findOne(userId, bookId);
    if (existing) throw { statusCode: 409, message: 'Book already in your library' };

    return userBooksRepository.create(userId, bookId);
  },

  async removeFromLibrary(userId: string, bookId: string): Promise<void> {
    const existing = await userBooksRepository.findOne(userId, bookId);
    if (!existing) throw { statusCode: 404, message: 'Book not in your library' };
    await userBooksRepository.delete(userId, bookId);
  },
};
