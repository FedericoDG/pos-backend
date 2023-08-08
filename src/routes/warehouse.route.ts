import { Router } from 'express';

const warehouse = Router();

// Controller
import { create, getAll, getById, getByUserId, remove, update } from '../controllers/warehouse.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createWarehouseSchema, updateWarehouseSchema } from '../schemas/warehouse.schema';

// Routes
warehouse.get('/', [validToken, accessLevel('USER')], getAll);
warehouse.get('/:id', [validToken, accessLevel('USER')], getById);
warehouse.get('/user/:id', [validToken, accessLevel('USER')], getByUserId);
warehouse.post(
  '/',
  [
    validToken,
    accessLevel('SUPERADMIN'),
    schemaValidator(createWarehouseSchema),
    valueIsAlreadyInUse({ model: 'warehouses', column: 'code' }),
  ],
  create,
);
warehouse.put('/:id', [validToken, accessLevel('SUPERADMIN'), schemaValidator(updateWarehouseSchema)], update);
warehouse.delete('/:id', [validToken, accessLevel('SUPERADMIN')], remove);

export default warehouse;
