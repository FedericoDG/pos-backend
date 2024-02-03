import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().nonempty(),
  identificationId: z.coerce.number().min(1),
  document: z.string().nonempty(),
  stateId: z.coerce.number().min(1),
  city: z.string().optional(),
  ivaTypeId: z.coerce.number().min(1),
  email: z.string().email().optional(),
  password: z.string().nonempty().min(6),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().optional(),
  identificationId: z.coerce.number().min(1),
  document: z.string().nonempty(),
  stateId: z.coerce.number().min(1),
  city: z.string().optional(),
  ivaTypeId: z.coerce.number().min(1),
  password: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  info: z.string().optional(),
});

export type CreateClientType = z.infer<typeof createClientSchema>;

export type UpdateClientType = z.infer<typeof updateClientSchema>;
