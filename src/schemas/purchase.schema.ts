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

export const updatePurchaseSchema = z.object({
  supplierId: z.number().nonnegative(),
  warehouseId: z.number().nonnegative(),
  total: z.number().nonnegative(),
  date: z.date(),
});

export type CreatePurchaseType = z.infer<typeof createPurchaseSchema>;

export type UpdatePurchaseType = z.infer<typeof updatePurchaseSchema>;
