import { Router } from 'express';

const role = Router();

// Controller
import { getAll, getById, update } from '../controllers/role.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schemas
import { updateRoleSchema } from '../schemas/role.schema';

// Routes
role.get('/', [validToken, accessLevel('ADMIN')], getAll);
role.get('/:id', [validToken, accessLevel('ADMIN')], getById);
role.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateRoleSchema)], update);

export default role;
