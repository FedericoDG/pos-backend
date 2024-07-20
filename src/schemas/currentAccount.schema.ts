import { CurrentAccountMovementType } from '@prisma/client';
import { z } from 'zod';

export const createPayment = z.object({
  currentAccountId: z.coerce.number().min(1),
  paymentMethodId: z.coerce.number().min(1),
  amount: z.coerce.number().min(1),
  type: z.nativeEnum(CurrentAccountMovementType),
  details: z.string(),
});

export const getCurrentAccountMovementsSchema = z.object({
  clientId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type CreatePaymentType = z.infer<typeof createPayment>;

export type CurrentAccountMovementsSchema = z.infer<typeof getCurrentAccountMovementsSchema>;
