import { z } from 'zod';

export const createCostSchema = z.object({
  cart: z.array(
    z.object({
      productId: z.number().nonnegative(),
      price: z.number().nonnegative(),
    }),
  ),
});

export type CreateCostType = z.infer<typeof createCostSchema>;
