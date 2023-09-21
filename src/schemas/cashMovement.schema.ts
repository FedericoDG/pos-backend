import { z } from 'zod';

export const createCashMovementsSchema = z.object({
  iva: z.boolean(),
  clientId: z.number().nonnegative(),
  warehouseId: z.number().nonnegative(),
  invoceTypeId: z.number().nonnegative(),
  cart: z.array(
    z.object({
      productId: z.number().nonnegative(),
      price: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
      tax: z.number().nonnegative(),
    }),
  ),
  otherTributes: z.array(
    z.object({
      id: z.number().nonnegative(),
      amount: z.number().nonnegative(),
      otherTributeId: z.number().nonnegative(),
      description: z.string().optional(),
    }),
  ),
  payments: z.array(
    z.object({
      amount: z.number().nonnegative(),
      paymentMethodId: z.number().nonnegative(),
    }),
  ),
  discount: z.number().nonnegative(),
  discountPercent: z.number().nonnegative(),
  recharge: z.number().nonnegative(),
  rechargePercent: z.number().nonnegative(),
  info: z.string(),
});

export type CreateCashMovementsType = z.infer<typeof createCashMovementsSchema>;
