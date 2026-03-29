import { booksRepository } from '../../repositories/books.repository';
import { categoriesRepository } from '../../repositories/categories.repository';

export const statsResolver = {
  Query: {
    adminStats: async () => {
      const [{ total, active, inactive }, categories] = await Promise.all([
        booksRepository.countByStatus(),
        categoriesRepository.findAll(),
      ]);

      const counts = await Promise.all(categories.map((c) => booksRepository.countByCategoryId(c.id)));

      return {
        totalBooks: total,
        activeBooks: active,
        inactiveBooks: inactive,
        totalCategories: categories.length,
        booksByCategory: categories.map((cat, i) => ({
          categoryId: cat.id,
          categoryName: cat.name,
          count: counts[i],
        })),
      };
    },
  },
};
