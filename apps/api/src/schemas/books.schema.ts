import { z } from 'zod';

export const bookInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().optional(),
  isbn: z.string().optional(),
  coverUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categoryId: z.string().optional(),
  publishedYear: z.number().int().min(1000).max(2100).optional(),
});

export const booksQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  // query params arrive as strings — coerce via enum+transform
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
