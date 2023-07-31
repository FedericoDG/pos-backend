import { Router } from 'express';

const client = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/client.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';

// Schema
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';

// Routes
client.get('/', [validToken, accessLevel('DRIVER')], getAll);
client.get('/:id', [validToken, accessLevel('DRIVER')], getById);
client.post(
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
client.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateClientSchema)], update);
client.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default client;
