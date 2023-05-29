import { Router } from 'express';

const user = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/supplier.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createSupplierSchema, updateSupplierSchema } from '../schemas/supplier.schema';

// Routes
user.get('/', [validToken, accessLevel('SELLER')], getAll);
user.get('/:id', [validToken, accessLevel('SELLER')], getById);
user.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createSupplierSchema),
    valueIsAlreadyInUse({ model: 'suppliers', column: 'cuit' }),
    valueIsAlreadyInUse({ model: 'suppliers', column: 'email' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateSupplierSchema)], update);
user.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default user;
