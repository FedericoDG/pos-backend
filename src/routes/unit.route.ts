import { Router } from 'express';

const unit = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/unit.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createUnitSchema, updateUnitSchema } from '../schemas/unit.schema';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Routes
unit.get('/', [validToken, accessLevel('USER')], getAll);
unit.get('/:id', [validToken, accessLevel('USER')], getById);
unit.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createUnitSchema),
    valueIsAlreadyInUse({ model: 'units', column: 'code' }),
  ],
  create,
);
unit.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateUnitSchema)], update);
unit.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default unit;
