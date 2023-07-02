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
purchase.get('/status', [validToken, accessLevel('SELLER')], status);
purchase.get('/:id', [validToken, accessLevel('ADMIN')], getById);
purchase.post('/', [validToken, accessLevel('SELLER'), schemaValidator(createCashRegisterSchema)], open);
purchase.put('/', [validToken, accessLevel('SELLER'), schemaValidator(updateCashRegisterSchema)], close);

export default purchase;
