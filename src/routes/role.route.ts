import { Router } from 'express';

const user = Router();

// Controller
import { getAll, getById, update } from '../controllers/role.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schemas
import { updateRoleSchema } from '../schemas/role.schema';

// Routes
user.get('/', [validToken, accessLevel('ADMIN')], getAll);
user.get('/:id', [validToken, accessLevel('ADMIN')], getById);
user.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateRoleSchema)], update);

export default user;
