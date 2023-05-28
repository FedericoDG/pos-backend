import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().nonempty(),
  lastname: z.string().nonempty(),
  document: z.string().nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().nonempty().min(6),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().optional(),
  lastname: z.string().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});

export type CreateClientType = z.infer<typeof createClientSchema>;

export type UpdateClientType = z.infer<typeof updateClientSchema>;
