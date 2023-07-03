import { z } from 'zod';

export const createCashMovementsSchema = z.object({
  clientId: z.number().nonnegative(),
  warehouseId: z.number().nonnegative(),
  paymentMethodId: z.number().nonnegative(),
  cart: z.array(
    z.object({
      productId: z.number().nonnegative(),
      price: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
    }),
  ),
  discount: z.number().nonnegative(),
  recharge: z.number().nonnegative(),
});

export type CreateCashMovementsType = z.infer<typeof createCashMovementsSchema>;
