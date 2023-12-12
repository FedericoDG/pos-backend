import { Router } from 'express';

const discharge = Router();

// Controller
import { create, getAll, getById } from '../controllers/discharge.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createDischargeSchema } from '../schemas/discharge.schema';
import { checkDischarge } from '../middlewares/checkDischarge';

// Routes
discharge.get('/', [validToken, accessLevel('ADMIN')], getAll);
discharge.get('/:id', [validToken, accessLevel('ADMIN')], getById);
discharge.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createDischargeSchema), checkDischarge], create);

export default discharge;
