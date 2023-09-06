import { Router } from 'express';

const priceList = Router();

// Controller
import {
  create,
  getAll,
  getById,
  getByIdAndWarehouseId,
  getByIdWarehouseIdAndProductId,
  remove,
  report,
  update,
} from '../controllers/pricelist.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createPriceListSchema, updatePriceListSchema } from '../schemas/pricelist.schema';

// Routes
priceList.get('/', [validToken, accessLevel('USER')], getAll);
priceList.get('/report', [validToken, accessLevel('USER')], report);
priceList.get('/:id', [validToken, accessLevel('USER')], getById);
priceList.get('/:id/:warehouseId', [validToken, accessLevel('USER')], getByIdAndWarehouseId);
priceList.get('/:id/:warehouseId/:productId', [validToken, accessLevel('USER')], getByIdWarehouseIdAndProductId);
priceList.post(
  '/',
  [
    validToken,
    accessLevel('SUPERADMIN'),
    schemaValidator(createPriceListSchema),
    valueIsAlreadyInUse({ model: 'pricelists', column: 'code' }),
  ],
  create,
);
priceList.put('/:id', [validToken, accessLevel('SUPERADMIN'), schemaValidator(updatePriceListSchema)], update);
priceList.delete('/:id', [validToken, accessLevel('SUPERADMIN')], remove);

export default priceList;
