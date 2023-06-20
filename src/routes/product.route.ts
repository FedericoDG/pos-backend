import { Router } from 'express';

const product = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/product.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

// Routes
product.get('/', [validToken, accessLevel('CLIENT')], getAll);
product.get('/:id', [validToken, accessLevel('CLIENT')], getById);
product.post(
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
product.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateProductSchema)], update);
product.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default product;
