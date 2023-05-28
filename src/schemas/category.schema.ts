import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  description: z.string().optional(),
});

export type CreateCategoryType = z.infer<typeof createCategorySchema>;

export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;
