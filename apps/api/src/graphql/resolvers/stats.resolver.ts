import { booksRepository } from '../../repositories/books.repository';
import { categoriesRepository } from '../../repositories/categories.repository';

export const statsResolver = {
  Query: {
    adminStats: () => {
      const { total, active, inactive } = booksRepository.countByStatus();
      const categories = categoriesRepository.findAll();

      const booksByCategory = categories.map((cat) => ({
        categoryId: cat.id,
        categoryName: cat.name,
        count: booksRepository.countByCategoryId(cat.id),
      }));

      return {
        totalBooks: total,
        activeBooks: active,
        inactiveBooks: inactive,
        totalCategories: categories.length,
        booksByCategory,
      };
    },
  },
};
