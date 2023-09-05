import { z } from 'zod';

export const createPriceSchema = z.object({
  productId: z.number().nonnegative().min(1),
  pricelistId: z.number().nonnegative().min(1),
  price: z.number().nonnegative().min(1),
});

export const createPriceManyPercentageSchema = z.object({
  cart: z.array(
    z.object({
      pricelistId: z.number(),
      productId: z.number(),
      price: z.number(),
    }),
  ),
});

export type CreatePriceType = z.infer<typeof createPriceSchema>;

export type CreatePriceManyPercentageType = z.infer<typeof createPriceManyPercentageSchema>;
