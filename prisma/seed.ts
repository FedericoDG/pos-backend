import { PrismaClient } from '@prisma/client';
import {
  categories,
  clients,
  costs,
  dischargeDetails,
  discharges,
  movements,
  pricelists,
  prices,
  products,
  purchaseDetails,
  purchases,
  reasons,
  roles,
  stocks,
  suppliers,
  transfer,
  transferDetails,
  units,
  users,
  warehouses,
} from './seeders';

const prisma = new PrismaClient();

async function main() {
  await prisma.roles.createMany({ data: roles });

  await prisma.users.createMany({ data: users });

  await prisma.categories.createMany({ data: categories });

  await prisma.units.createMany({ data: units });

  await prisma.products.createMany({ data: products });

  await prisma.warehouses.createMany({ data: warehouses });

  await prisma.stocks.createMany({ data: stocks });

  await prisma.suppliers.createMany({ data: suppliers });

  await prisma.clients.createMany({ data: clients });

  await prisma.reasons.createMany({ data: reasons });

  await prisma.pricelists.createMany({ data: pricelists });

  await prisma.prices.createMany({ data: prices });

  await prisma.purchases.createMany({ data: purchases });

  await prisma.purchaseDetails.createMany({ data: purchaseDetails });

  await prisma.costs.createMany({ data: costs });

  await prisma.movements.createMany({ data: movements });

  await prisma.discharges.createMany({ data: discharges });

  await prisma.dischargeDetails.createMany({ data: dischargeDetails });

  await prisma.transfer.createMany({ data: transfer });

  await prisma.transferDetails.createMany({ data: transferDetails });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
