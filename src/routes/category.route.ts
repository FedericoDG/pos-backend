import { Router } from 'express';

const user = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/category.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

// Routes
user.get('/', [validToken, accessLevel('CLIENT')], getAll);
user.get('/:id', [validToken, accessLevel('CLIENT')], getById);
user.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createCategorySchema),
    valueIsAlreadyInUse({ model: 'categories', column: 'name' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateCategorySchema)], update);
user.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default user;
