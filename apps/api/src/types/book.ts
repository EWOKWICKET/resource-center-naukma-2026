import { Genre } from '../enums/genre.enum';
import { Language } from '../enums/language.enum';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  genres: Genre[];
  description?: string;
  isbn?: string;
  publishedYear?: number;
  publisher?: string;
  language?: Language;
  pageCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
