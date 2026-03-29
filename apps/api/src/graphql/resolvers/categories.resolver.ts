import { categoriesService } from '../../services/categories.service';
import { booksRepository } from '../../repositories/books.repository';

export const categoriesResolver = {
  Query: {
    categoriesWithStats: async () => {
      const categories = await categoriesService.findAll();
      const counts = await Promise.all(categories.map((c) => booksRepository.countByCategoryId(c.id)));

      return categories.map((category, i) => ({ ...category, activeBookCount: counts[i] }));
    },
  },
};
