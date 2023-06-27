import { Router } from 'express';

const purchase = Router();

// Controller
import { close, getAll, getById, open, status } from '../controllers/cashRegister.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCashRegisterSchema, updateCashRegisterSchema } from '../schemas/cashRegister.schema';

// Routes
purchase.get('/', [validToken, accessLevel('ADMIN')], getAll);
purchase.get('/status', [validToken, accessLevel('ADMIN')], status);
purchase.get('/:id', [validToken, accessLevel('ADMIN')], getById);
purchase.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createCashRegisterSchema)], open);
purchase.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateCashRegisterSchema)], close);

export default purchase;
