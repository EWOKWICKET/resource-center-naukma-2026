import { booksService } from '../../services/books.service';
import { BookFilters } from '../../types';

export const booksResolver = {
  Query: {
    books: (_: unknown, args: BookFilters) => {
      return booksService.findAll(args);
    },

    book: (_: unknown, { id }: { id: string }) => {
      return booksService.findById(id);
    },
  },
};
