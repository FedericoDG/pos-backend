import { z } from 'zod';

export const createUnitSchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
});

export const updateUnitSchema = z.object({
  name: z.string().nonempty().optional(),
});

export type CreateUnitType = z.infer<typeof createUnitSchema>;

export type UpdateUnitType = z.infer<typeof updateUnitSchema>;
