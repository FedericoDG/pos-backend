import { Router } from 'express';

const supplier = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/supplier.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createSupplierSchema, updateSupplierSchema } from '../schemas/supplier.schema';

// Routes
supplier.get('/', [validToken, accessLevel('SELLER')], getAll);
supplier.get('/:id', [validToken, accessLevel('SELLER')], getById);
supplier.post(
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
supplier.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateSupplierSchema)], update);
supplier.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default supplier;
