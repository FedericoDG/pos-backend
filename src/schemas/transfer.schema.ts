import { z } from 'zod';

export const createTransferSchema = z.object({
  warehouseOriginId: z.number().nonnegative(),
  warehouseDestinationId: z.number().nonnegative(),
  cart: z.array(
    z.object({
      productId: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
    }),
  ),
});

export type CreateTransferType = z.infer<typeof createTransferSchema>;
