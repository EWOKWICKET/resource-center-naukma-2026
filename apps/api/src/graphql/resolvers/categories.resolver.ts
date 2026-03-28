import { categoriesService } from '../../services/categories.service';
import { booksRepository } from '../../repositories/books.repository';

export const categoriesResolver = {
  Query: {
    categoriesWithStats: () => {
      return categoriesService.findAll().map((category) => ({
        ...category,
        activeBookCount: booksRepository.countByCategoryId(category.id),
      }));
    },
  },
};
