import { z } from 'zod';

export const createStockSchema = z.object({
  body: z.object({
    stock: z.number().optional(),
    prevstock: z.number().optional(),
    prevdate: z.string().datetime({ offset: true }).optional(),
  }),
});

export const updateStockSchema = z.object({
  params: z.object({
    id: z.string().nonempty(),
  }),
  body: z.object({
    stock: z.number().optional(),
    prevstock: z.number().optional(),
    prevdate: z.string().datetime({ offset: true }).optional(),
  }),
});

export type CreateStockType = z.infer<typeof createStockSchema>['body'];

export type UpdateStockBodyType = z.infer<typeof updateStockSchema>['body'];

export type UpdateStockParamsType = z.infer<typeof updateStockSchema>['params'];
