import { Router } from 'express';

const user = Router();

// Controller
import { create, getAll, getById, remove, resetPassword, update } from '../controllers/user.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { valueIsAlreadyInUse } from '../middlewares/valueIsAlreadyInUse';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createUserSchema, updateUserSchema, resetPasswordUserSchema } from '../schemas/user.schema';

// Routes
user.get('/', [validToken, accessLevel('ADMIN')], getAll);
user.get('/:id', [validToken, accessLevel('USER')], getById);
user.post(
  '/',
  [
    validToken,
    accessLevel('ADMIN'),
    schemaValidator(createUserSchema),
    valueIsAlreadyInUse({ model: 'users', column: 'email' }),
  ],
  create,
);
user.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateUserSchema)], update);
user.put(
  '/resetpassword/:id',
  [validToken, accessLevel('DRIVER'), schemaValidator(resetPasswordUserSchema)],
  resetPassword,
);
user.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default user;
