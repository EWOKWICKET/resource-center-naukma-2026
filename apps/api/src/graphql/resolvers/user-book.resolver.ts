import { MercuriusContext } from 'mercurius';
import { userBooksRepository } from '../../repositories/user-books.repository';
import { booksRepository } from '../../repositories/books.repository';
import { User } from '../../types';

declare module 'mercurius' {
  interface MercuriusContext {
    user?: User;
  }
}

export const userBookResolver = {
  Query: {
    myLibrary: async (_: unknown, __: unknown, ctx: MercuriusContext) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const userBooks = await userBooksRepository.findByUserId(ctx.user.id);
      const bookIds = userBooks.map((ub) => ub.bookId);

      return booksRepository.findByIds(bookIds);
    },
  },

  Mutation: {
    addToLibrary: async (_: unknown, { bookId }: { bookId: string }, ctx: MercuriusContext) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      const existing = await userBooksRepository.findOne(ctx.user.id, bookId);
      if (existing) return existing;

      return userBooksRepository.create(ctx.user.id, bookId);
    },

    removeFromLibrary: async (_: unknown, { bookId }: { bookId: string }, ctx: MercuriusContext) => {
      if (!ctx.user) {
        throw new Error('Unauthorized');
      }
      await userBooksRepository.delete(ctx.user.id, bookId);

      return true;
    },
  },
};
