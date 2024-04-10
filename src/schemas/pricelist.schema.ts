import { z } from 'zod';

export const createPriceListSchema = z.object({
  code: z.string().nonempty(),
  description: z.string().optional(),
});

export const updatePriceListSchema = z.object({
  description: z.string().optional(),
});

export const queryPriceListSchema = z.object({
  id: z.number().min(1),
  warehouseId: z.number().min(1),
  query: z.string(),
});

export type CreatePriceListType = z.infer<typeof createPriceListSchema>;

export type UpdatePriceListType = z.infer<typeof updatePriceListSchema>;

export type QueryPriceListType = z.infer<typeof queryPriceListSchema>;
