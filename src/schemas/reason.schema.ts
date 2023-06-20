import { z } from 'zod';

export const createReasonSchema = z.object({
  reason: z.string().nonempty(),
});

export const updateReasonSchema = z.object({
  reason: z.string().nonempty(),
});

export type CreateReasonType = z.infer<typeof createReasonSchema>;

export type UpdateReasonType = z.infer<typeof updateReasonSchema>;
