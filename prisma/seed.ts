import { PrismaClient } from '@prisma/client';
import { settings } from './seeders/settings';
import {
  afip,
  cashMovementDetails,
  cashMovements,
  cashRegisters,
  categories,
  clients,
  costs,
  dischargeDetails,
  discharges,
  identifications,
  invoceTypes,
  ivaConditions,
  ivaType,
  movements,
  otherTributes,
  paymentMethodDetails,
  paymentMethods,
  pricelists,
  prices,
  products,
  purchaseDetails,
  purchases,
  reasons,
  roles,
  stockDetails,
  stocks,
  suppliers,
  transfer,
  transferDetails,
  units,
  userPreferences,
  users,
  warehouses,
} from './seeders';

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.createMany({ data: settings });

  await prisma.afip.createMany({ data: afip });

  await prisma.roles.createMany({ data: roles });

  await prisma.users.createMany({ data: users });

  await prisma.categories.createMany({ data: categories });

  await prisma.units.createMany({ data: units });

  await prisma.ivaConditions.createMany({ data: ivaConditions });

  await prisma.ivaType.createMany({ data: ivaType });

  await prisma.products.createMany({ data: products });

  await prisma.warehouses.createMany({ data: warehouses });

  await prisma.stocks.createMany({ data: stocks });

  await prisma.suppliers.createMany({ data: suppliers });

  await prisma.identifications.createMany({ data: identifications });

  await prisma.clients.createMany({ data: clients });

  await prisma.reasons.createMany({ data: reasons });

  await prisma.pricelists.createMany({ data: pricelists });

  await prisma.prices.createMany({ data: prices });

  await prisma.purchases.createMany({ data: purchases });

  await prisma.purchaseDetails.createMany({ data: purchaseDetails });

  await prisma.costs.createMany({ data: costs });

  await prisma.paymentMethods.createMany({ data: paymentMethods });

  await prisma.discharges.createMany({ data: discharges });

  await prisma.dischargeDetails.createMany({ data: dischargeDetails });

  await prisma.transfer.createMany({ data: transfer });

  await prisma.transferDetails.createMany({ data: transferDetails });

  await prisma.invoceTypes.createMany({ data: invoceTypes });

  await prisma.cashRegisters.createMany({ data: cashRegisters });

  await prisma.cashMovements.createMany({ data: cashMovements });

  await prisma.movements.createMany({ data: movements });

  await prisma.cashMovementsDetails.createMany({ data: cashMovementDetails });

  await prisma.paymentMethodDetails.createMany({ data: paymentMethodDetails });

  await prisma.userPreferences.createMany({ data: userPreferences });

  await prisma.otherTributes.createMany({ data: otherTributes });

  await prisma.stocksDetails.createMany({ data: stockDetails });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
