import { Router } from 'express';

const category = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/category.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

// Routes
category.get('/', [validToken, accessLevel('CLIENT')], getAll);
category.get('/:id', [validToken, accessLevel('CLIENT')], getById);
category.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createCategorySchema),
    valueIsAlreadyInUse({ model: 'categories', column: 'name' }),
  ],
  create,
);
category.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateCategorySchema)], update);
category.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default category;
