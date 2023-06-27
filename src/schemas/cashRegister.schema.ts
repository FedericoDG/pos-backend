import { z } from 'zod';

export const createCashRegisterSchema = z.object({
  openingDate: z.string().datetime(),
  initialBalance: z.number().nonnegative(),
});

export const updateCashRegisterSchema = z.object({
  closingDate: z.string().datetime(),
  finalBalance: z.number().nonnegative().optional(),
});

export type CreateCashRegisterType = z.infer<typeof createCashRegisterSchema>;

export type UpdateCashRegisterType = z.infer<typeof updateCashRegisterSchema>;
