import { MercuriusContext } from 'mercurius';
import { userBooksRepository } from '../../repositories/user-books.repository';
import { User } from '../../types';

declare module 'mercurius' {
  interface MercuriusContext {
    user?: User;
  }
}

export const userBookResolver = {
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
