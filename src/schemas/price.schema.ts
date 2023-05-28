import { z } from 'zod';

export const createPriceSchema = z.object({
  productId: z.number().nonnegative().min(1),
  pricelistId: z.number().nonnegative().min(1),
  price: z.number().nonnegative().min(1),
});

export type CreatePriceType = z.infer<typeof createPriceSchema>;
