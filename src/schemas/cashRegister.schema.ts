import { z } from 'zod';

export const createCashRegisterSchema = z.object({
  openingDate: z.string().datetime(),
  initialBalance: z.number().nonnegative(),
});

export const updateCashRegisterSchema = z.object({
  closingDate: z.string().datetime(),
});

export const updateCashRegisterSchemaById = z.object({
  warehouseId: z.number().nonnegative(),
  cart: z.array(
    z.object({
      productId: z.number().nonnegative(),
      reasonId: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
      cost: z.number().nonnegative(),
      info: z.string().optional(),
    }),
  ),
  //warehouseOriginId: z.number().nonnegative(),
  warehouseDestinationId: z.number().nonnegative(),
  /*  cart2: z.array(
    z.object({
      productId: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
    }),
  ), */
  closingDate: z.string().datetime(),
});

export type CreateCashRegisterType = z.infer<typeof createCashRegisterSchema>;

export type UpdateCashRegisterType = z.infer<typeof updateCashRegisterSchema>;

export type UpdateCashRegisterByIdType = z.infer<typeof updateCashRegisterSchemaById>;
