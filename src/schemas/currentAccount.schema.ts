import { CurrentAccountMovementType } from '@prisma/client';
import { z } from 'zod';

export const createPayment = z.object({
  currentAccountId: z.coerce.number().min(1),
  paymentMethodId: z.coerce.number().min(1),
  amount: z.coerce.number().min(1),
  type: z.nativeEnum(CurrentAccountMovementType),
  details: z.string(),
});

export type CreatePaymentType = z.infer<typeof createPayment>;
