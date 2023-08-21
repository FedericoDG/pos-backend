import { Categories, IvaConditions, Pricelists, Prices, Products, Stocks, Units, Warehouses } from '@prisma/client';

type ProductExtended = Products & Categories & Units;

type StockExtended = (Stocks & {
  warehouse: Warehouses;
})[];

type PriceListExtended =
  | (Pricelists & {
      prices: (Prices & {
        products: Products & {
          unit: Units;
          category: Categories;
          ivaCondition: IvaConditions;
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
        unit: {
          id: price.products.unit.id,
          code: price.products.unit.code,
          name: price.products.unit.name,
        },
        ivaCondition: {
          id: price.products.ivaCondition.id,
          code: price.products.ivaCondition.code,
          tax: price.products.ivaCondition.tax,
          description: price.products.ivaCondition.description,
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
          warehouse: {
            id: stock.warehouse.id,
            code: stock.warehouse.code,
            description: stock.warehouse.description,
            address: stock.warehouse.address,
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
