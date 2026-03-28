import { z } from 'zod';

export const categoryInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const categoryStatusSchema = z.object({
  isActive: z.boolean(),
});

export const categoryParamsSchema = z.object({
  id: z.string(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
