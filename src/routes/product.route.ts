import { Router } from 'express';

const user = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/product.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

// Routes
user.get('/', [validToken, accessLevel('CLIENT')], getAll);
user.get('/:id', [validToken, accessLevel('CLIENT')], getById);
user.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createProductSchema),
    valueIsAlreadyInUse({ model: 'products', column: 'code' }),
    valueIsAlreadyInUse({ model: 'products', column: 'barcode' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateProductSchema)], update);
user.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default user;
