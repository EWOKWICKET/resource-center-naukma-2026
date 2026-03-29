import { booksService } from '../../services/books.service';
import { categoriesService } from '../../services/categories.service';
import { Book, BookFilters } from '../../types';

export const booksResolver = {
  Query: {
    books: (_: unknown, args: BookFilters) => {
      return booksService.findAll(args);
    },

    book: (_: unknown, { id }: { id: string }) => {
      return booksService.findById(id);
    },
  },

  Book: {
    category: (book: Book) => {
      if (!book.categoryId) return null;

      return categoriesService.findById(book.categoryId);
    },
  },
};
