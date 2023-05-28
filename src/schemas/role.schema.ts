import { z } from 'zod';

export const updateRoleSchema = z.object({
  description: z.string().nonempty(),
});

export type UpdateRoleBodyType = z.infer<typeof updateRoleSchema>;
