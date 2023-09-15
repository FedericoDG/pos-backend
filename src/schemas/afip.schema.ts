import { z } from 'zod';

export const afipSchema = z.object({});

export type afipType = z.infer<typeof afipSchema>;
