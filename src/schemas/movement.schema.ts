import { z } from 'zod';

export const getMovementsSchema = z.object({
  userId: z.number().nonnegative().optional(),
  paymentMethodId: z.number().nonnegative().optional(),
  from: z.string().nonempty(),
  to: z.string().nonempty(),
});

export type getMovementsType = z.infer<typeof getMovementsSchema>;
