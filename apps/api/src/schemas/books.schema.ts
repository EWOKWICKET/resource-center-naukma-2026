import { z } from 'zod';
import { Genre } from '../enums/genre.enum';
import { Language } from '../enums/language.enum';

const genreValues = Object.values(Genre) as [string, ...string[]];
const languageValues = Object.values(Language) as [string, ...string[]];

export const bookInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.array(z.string().min(1)).min(1, 'At least one author is required'),
  genres: z.array(z.enum(genreValues)).optional().default([]),
  description: z.string().optional(),
  isbn: z.string().optional(),
  publishedYear: z.number().int().min(1000).max(2200).optional(),
  publisher: z.string().optional(),
  language: z.enum(languageValues).optional(),
  pageCount: z.number().int().positive().optional(),
});

export const booksQuerySchema = z.object({
  search: z.string().optional(),
  genre: z
    .enum(genreValues)
    .transform((v) => v as Genre)
    .optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export const bookStatusSchema = z.object({
  isActive: z.boolean(),
});

export const bookParamsSchema = z.object({
  id: z.string(),
});

export type BookInput = z.infer<typeof bookInputSchema>;
export type BooksQuery = z.infer<typeof booksQuerySchema>;
