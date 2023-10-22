import { z } from 'zod';

export const getMovementsSchema = z.object({
  userId: z.string().nonempty().optional(),
  clientId: z.string().nonempty().optional(),
  paymentMethodId: z.string().nonempty().optional(),
  from: z.string().nonempty().optional(),
  to: z.string().nonempty().optional(),
});

export type getMovementsType = z.infer<typeof getMovementsSchema>;
