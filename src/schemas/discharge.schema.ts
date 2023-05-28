import { z } from 'zod';

export const createDischargeSchema = z.object({
  reasonId: z.number().optional(),
  description: z.string().optional(),
});

export const updateDischargeSchema = z.object({
  reasonId: z.number().optional(),
  description: z.string().optional(),
});

export type CreateDischargeType = z.infer<typeof createDischargeSchema>;

export type UpdateDischargeType = z.infer<typeof updateDischargeSchema>;
