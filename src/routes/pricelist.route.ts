import { Router } from 'express';

const user = Router();

// Controller
import {
  create,
  getAll,
  getByIdAndWarehouseId,
  getByIdWarehouseIdAndProductId,
  remove,
  update,
} from '../controllers/pricelist.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createPriceListSchema, updatePriceListSchema } from '../schemas/pricelist.schema';

// Routes
user.get('/', [validToken, accessLevel('USER')], getAll);
user.get('/:id/:warehouseId', [validToken, accessLevel('USER')], getByIdAndWarehouseId);
user.get('/:id/:warehouseId/:productId', [validToken, accessLevel('USER')], getByIdWarehouseIdAndProductId);
user.post(
  '/',
  [
    validToken,
    accessLevel('SUPERADMIN'),
    schemaValidator(createPriceListSchema),
    valueIsAlreadyInUse({ model: 'pricelists', column: 'code' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('SUPERADMIN'), schemaValidator(updatePriceListSchema)], update);
user.delete('/:id', [validToken, accessLevel('SUPERADMIN')], remove);

export default user;
