import { Book } from './book';

export interface BookFilters {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface BooksPage {
  items: Book[];
  total: number;
  page: number;
  limit: number;
}
