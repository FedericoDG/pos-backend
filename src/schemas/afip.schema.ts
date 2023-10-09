import { z } from 'zod';

export const afipEditSttingsSchema = z.object({
  posNumber: z.number().nonnegative(),
  maxPerInvoice: z.number().nonnegative(),
});

export type afipEditSttingsType = z.infer<typeof afipEditSttingsSchema>;
