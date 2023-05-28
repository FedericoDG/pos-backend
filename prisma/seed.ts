import { PrismaClient } from '@prisma/client';
import {
  categories,
  clients,
  discharges,
  products,
  reasons,
  roles,
  stocks,
  suppliers,
  units,
  users,
  warehouses,
  pricelists,
  prices,
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

  await prisma.discharges.createMany({ data: discharges });
}

main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect;
  });
