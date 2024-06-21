import { z } from 'zod';

export const updateSettingsSchema = z.object({
  name: z.string().nonempty(),
  address: z.string().nonempty(),
  cp: z.string().nonempty(),
  province: z.string().nonempty(),
  ivaCondition: z.string().nonempty(),
  cuit: z.string().nonempty(),
  invoceName: z.string().nonempty(),
  invoceNumber: z.number().nonnegative(),
  imageURL: z.string(),
  showOtherTaxes: z.number().nonnegative(),
  responsableInscripto: z.number().nonnegative(),
});

export type updateSettingsType = z.infer<typeof updateSettingsSchema>;
