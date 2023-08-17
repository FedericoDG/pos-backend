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
  preferences: z.object({
    warehouseId: z.coerce.number().min(1),
    priceListId: z.coerce.number().min(1),
    clientId: z.coerce.number().min(1),
  }),
});

export const resetPasswordUserSchema = z.object({
  password: z.string().min(6),
});

export type CreateUserType = z.infer<typeof createUserSchema>;

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export type ResetPasswordUserType = z.infer<typeof resetPasswordUserSchema>;
