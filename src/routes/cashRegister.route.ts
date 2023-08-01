import { Router } from 'express';

const purchase = Router();

// Controller
import { close, getAll, getById, open, status, statusByUserId } from '../controllers/cashRegister.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCashRegisterSchema, updateCashRegisterSchema } from '../schemas/cashRegister.schema';

// Routes
purchase.get('/', [validToken, accessLevel('ADMIN')], getAll);
purchase.get('/status', [validToken, accessLevel('DRIVER')], status);
purchase.get('/statusByUserId/:id', [validToken, accessLevel('DRIVER')], statusByUserId);
purchase.get('/:id', [validToken, accessLevel('DRIVER')], getById);
purchase.post('/', [validToken, accessLevel('DRIVER'), schemaValidator(createCashRegisterSchema)], open);
purchase.put('/', [validToken, accessLevel('DRIVER'), schemaValidator(updateCashRegisterSchema)], close);

export default purchase;
