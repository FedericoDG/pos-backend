import { z } from 'zod';

export const createWarehouseSchema = z.object({
  code: z.string().nonempty(),
  description: z.string().optional(),
  address: z.string().optional(),
  driver: z.number().optional(),
  //
  name: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

export const updateWarehouseSchema = z.object({
  description: z.string().optional(),
  address: z.string().optional(),
  driver: z.number().optional(),
  //
  name: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

export type CreateWarehouseType = z.infer<typeof createWarehouseSchema>;

export type UpdateWarehouseType = z.infer<typeof updateWarehouseSchema>;
