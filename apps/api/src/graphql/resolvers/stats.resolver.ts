import { booksRepository } from '../../repositories/books.repository';

export const statsResolver = {
  Query: {
    adminStats: async () => {
      const { total, active, inactive } = await booksRepository.countByStatus();

      return { totalBooks: total, activeBooks: active, inactiveBooks: inactive };
    },
  },
};
