import { z } from 'zod';

export const createPurchaseSchema = z.object({
  supplierId: z.number().nonnegative(),
  warehouseId: z.number().nonnegative(),
  total: z.number().nonnegative(),
  date: z.string().datetime(),
  driver: z.string().nonempty(),
  transport: z.string().nonempty(),
  cart: z.array(
    z.object({
      productId: z.number().nonnegative(),
      price: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
    }),
  ),
});

export type CreatePurchaseType = z.infer<typeof createPurchaseSchema>;
