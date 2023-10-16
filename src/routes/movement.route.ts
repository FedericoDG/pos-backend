import { Router } from 'express';

const purchase = Router();

// Controller
import { getAll } from '../controllers/movement.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { getMovementsSchema } from '../schemas/movement.schema';

// Routes
purchase.get('/', [validToken, accessLevel('ADMIN'), schemaValidator(getMovementsSchema)], getAll);

export default purchase;
