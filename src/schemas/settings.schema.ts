import { z } from 'zod';

export const updateSettingsSchema = z.object({
  name: z.string().nonempty(),
  address: z.string().nonempty(),
  cp: z.string().nonempty(),
  province: z.string().nonempty(),
  ivaCondition: z.string().nonempty(),
  cuit: z.string().nonempty(),
  posNumber: z.number().nonnegative(),
  invoceName: z.string().nonempty(),
  invoceNumber: z.number().nonnegative(),
  imageURL: z.string(),
});

export type updateSettingsType = z.infer<typeof updateSettingsSchema>;
