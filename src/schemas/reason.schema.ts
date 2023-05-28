import { z } from 'zod';

export const createReasonSchema = z.object({
  body: z.object({
    reason: z.string().nonempty(),
  }),
});

export const updateReasonSchema = z.object({
  params: z.object({
    id: z.string().nonempty(),
  }),
  body: z.object({
    reason: z.string().optional(),
  }),
});

export type CreateReasonType = z.infer<typeof createReasonSchema>['body'];

export type UpdateReasonBodyType = z.infer<typeof updateReasonSchema>['body'];

export type UpdateReasonParamsType = z.infer<typeof updateReasonSchema>['params'];
