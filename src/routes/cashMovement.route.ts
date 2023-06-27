import { Router } from 'express';

const purchase = Router();

// Controller
import { create, getAll, getById } from '../controllers/cashMovement.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCashMovementsSchema } from '../schemas/cashMovement.schema';

// Routes
purchase.get('/', [validToken, accessLevel('ADMIN')], getAll);
purchase.get('/:id', [validToken, accessLevel('ADMIN')], getById);
purchase.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createCashMovementsSchema)], create);

export default purchase;
