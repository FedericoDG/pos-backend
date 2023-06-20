import { z } from 'zod';

export const createDischargeSchema = z.object({
  warehouseId: z.number().nonnegative(),
  cart: z.array(
    z.object({
      productId: z.number().nonnegative(),
      reasonId: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
      info: z.string().optional(),
    }),
  ),
});

export const updateDischargeSchema = z.object({
  info: z.string().nonempty(),
});

export type CreateDischargeType = z.infer<typeof createDischargeSchema>;

export type UpdateDischargeType = z.infer<typeof updateDischargeSchema>;
