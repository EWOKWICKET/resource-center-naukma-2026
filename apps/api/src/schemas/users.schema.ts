import { z } from 'zod';

export const userParamsSchema = z.object({
  id: z.string(),
});

export const libraryBookParamsSchema = z.object({
  id: z.string(),
  bookId: z.string(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  bio: z.string().optional(),
});

export const addToLibrarySchema = z.object({
  bookId: z.string(),
});

export type UserParams = z.infer<typeof userParamsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddToLibraryInput = z.infer<typeof addToLibrarySchema>;
