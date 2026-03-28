import { booksService } from '../../services/books.service';
import { categoriesService } from '../../services/categories.service';
import { Book, BookFilters } from '../../types';

interface BooksArgs extends BookFilters {}
interface BookByIdArgs {
  id: string;
}

export const booksResolver = {
  Query: {
    books: (_parent: unknown, args: BooksArgs) => {
      return booksService.findAll(args);
    },

    book: (_parent: unknown, { id }: BookByIdArgs) => {
      try {
        return booksService.findById(id);
      } catch {
        return null;
      }
    },
  },

  // Field resolver: fetches the nested Category for a Book in one GraphQL request,
  // saving the client a separate REST call to /api/categories/:id
  Book: {
    category: (book: Book) => {
      if (!book.categoryId) return null;
      try {
        return categoriesService.findById(book.categoryId);
      } catch {
        return null;
      }
    },
  },
};
