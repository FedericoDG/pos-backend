import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.coerce.number().min(1).max(4).optional(), // 1: SUPERADMIN, 2: ADMIN, 3: SELLER, 4: USER
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  roleId: z.coerce.number().min(1).max(4).optional(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;

export type UpdateUserType = z.infer<typeof updateUserSchema>;
