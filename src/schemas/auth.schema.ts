import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().nonempty().min(6),
});

export type LoginType = z.infer<typeof loginSchema>;
