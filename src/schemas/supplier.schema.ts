import { z } from 'zod';

export const createSupplierSchema = z.object({
  cuit: z.string().nonempty(),
  name: z.string().nonempty(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});

export const updateSupplierSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});

export type CreateSupplierType = z.infer<typeof createSupplierSchema>;

export type UpdateSupplierType = z.infer<typeof updateSupplierSchema>;
