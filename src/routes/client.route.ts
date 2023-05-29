import { Router } from 'express';

const user = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/client.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';

// Routes
user.get('/', [validToken, accessLevel('SELLER')], getAll);
user.get('/:id', [validToken, accessLevel('SELLER')], getById);
user.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createClientSchema),
    valueIsAlreadyInUse({ model: 'clients', column: 'document' }),
    valueIsAlreadyInUse({ model: 'clients', column: 'email' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateClientSchema)], update);
user.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default user;
