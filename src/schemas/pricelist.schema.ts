import { z } from 'zod';

export const createPriceListSchema = z.object({
  code: z.string().nonempty(),
  description: z.string().optional(),
});

export const updatePriceListSchema = z.object({
  description: z.string().optional(),
});

export type CreatePriceListType = z.infer<typeof createPriceListSchema>;

export type UpdatePriceListType = z.infer<typeof updatePriceListSchema>;
