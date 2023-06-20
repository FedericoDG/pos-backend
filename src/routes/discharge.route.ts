import { Router } from 'express';

const discharge = Router();

// Controller
import { create, getAll, getById, update } from '../controllers/discharge.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createDischargeSchema, updateDischargeSchema } from '../schemas/discharge.schema';

// Routes
discharge.get('/', [validToken, accessLevel('ADMIN')], getAll);
discharge.get('/:id', [validToken, accessLevel('ADMIN')], getById);
discharge.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createDischargeSchema)], create);
discharge.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateDischargeSchema)], update);

export default discharge;
