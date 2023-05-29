import { Categories, Pricelists, Prices, Products, Stocks, Units, Warehouses } from '@prisma/client';

type ProductExtended = Products & Categories & Units;

type StockExtended = (Stocks & {
  warehouses: Warehouses;
})[];

type PriceListExtended =
  | (Pricelists & {
      prices: (Prices & {
        products: Products & {
          units: Units;
          category: Categories;
        };
      })[];
    })
  | null;

export const getList = (pricelist: PriceListExtended, stocks: StockExtended, product: string) => {
  const reducedObject = pricelist?.prices.reduce((acc, price) => {
    const productId = price.productId;
    if (!acc[productId]) {
      acc[productId] = {
        id: price.products.id,
        code: price.products.code,
        barcode: price.products.barcode,
        name: price.products.name,
        status: price.products.status,
        allownegativestock: price.products.allownegativestock,
        description: price.products.description,
        price: price.price,
        category: {
          id: price.products.category.id,
          name: price.products.category.name,
          description: price.products.category.description,
        },
        units: {
          id: price.products.units.id,
          code: price.products.units.code,
          name: price.products.units.name,
        },
      };
    }
    return acc;
  }, {});
  const products: ProductExtended[] = Object.values(reducedObject!);

  const mergedArray = stocks
    .map((stock) => {
      const productId = stock.productId;
      const existingObj = products.find((obj) => obj.id === productId);

      if (existingObj) {
        return {
          ...existingObj,
          stock: stock.stock,
          warehouses: {
            id: stock.warehouses.id,
            code: stock.warehouses.code,
            description: stock.warehouses.description,
            address: stock.warehouses.address,
          },
        };
      }

      return null;
    })
    .filter(
      (obj) => obj !== null && obj.status == 'ENABLED' && (obj?.stock > 0 || obj?.allownegativestock === 'ENABLED'),
    );

  if (product === 'product') {
    return {
      id: pricelist?.id,
      code: pricelist?.code,
      description: pricelist?.description,
      createdAt: pricelist?.createdAt,
      updatedAt: pricelist?.updatedAt,
      product: mergedArray[0],
    };
  } else {
    return {
      id: pricelist?.id,
      code: pricelist?.code,
      description: pricelist?.description,
      createdAt: pricelist?.createdAt,
      updatedAt: pricelist?.updatedAt,
      products: mergedArray,
    };
  }
};
