import { Router } from 'express';

const user = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/unit.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createUnitSchema, updateUnitSchema } from '../schemas/unit.schema';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Routes
user.get('/', [validToken, accessLevel('USER')], getAll);
user.get('/:id', [validToken, accessLevel('USER')], getById);
user.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createUnitSchema),
    valueIsAlreadyInUse({ model: 'units', column: 'code' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateUnitSchema)], update);
user.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default user;
