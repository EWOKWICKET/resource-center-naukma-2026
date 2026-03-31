export enum Genre {
  Fiction = 'fiction',
  NonFiction = 'non-fiction',
  Science = 'science',
  History = 'history',
  Biography = 'biography',
  Technology = 'technology',
  Philosophy = 'philosophy',
  Art = 'art',
  Law = 'law',
  Medicine = 'medicine',
  Other = 'other',
}

export enum Language {
  Ukrainian = 'ukrainian',
  English = 'english',
  German = 'german',
  French = 'french',
  Polish = 'polish',
  Other = 'other',
}

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

export interface BookInput {
  title: string;
  authors: string[];
  genres: Genre[];
  description?: string;
  isbn?: string;
  publishedYear?: number;
  publisher?: string;
  language?: Language;
  pageCount?: number;
}

export interface BookFilters {
  search?: string;
  genre?: Genre;
  isActive?: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
