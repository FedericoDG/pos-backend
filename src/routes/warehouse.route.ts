import { Router } from 'express';

const user = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/warehouse.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createWarehouseSchema, updateWarehouseSchema } from '../schemas/warehouse.schema';

// Routes
user.get('/', [validToken, accessLevel('USER')], getAll);
user.get('/:id', [validToken, accessLevel('USER')], getById);
user.post(
  '/',
  [
    validToken,
    accessLevel('SUPERADMIN'),
    schemaValidator(createWarehouseSchema),
    valueIsAlreadyInUse({ model: 'warehouses', column: 'code' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('SUPERADMIN'), schemaValidator(updateWarehouseSchema)], update);
user.delete('/:id', [validToken, accessLevel('SUPERADMIN')], remove);

export default user;
