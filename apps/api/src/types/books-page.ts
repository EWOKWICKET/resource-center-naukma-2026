import { Genre } from '../enums/genre.enum';

export interface BookFilters {
  search?: string;
  genre?: Genre;
  isActive?: boolean;
}
