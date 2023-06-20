import { Router } from 'express';

const purchase = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/purchase.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createPurchaseSchema, updatePurchaseSchema } from 'src/schemas/purchase.schema';

// Routes
purchase.get('/', [validToken, accessLevel('ADMIN')], getAll);
purchase.get('/:id', [validToken, accessLevel('ADMIN')], getById);
purchase.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createPurchaseSchema)], create);
//purchase.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updatePurchaseSchema)], update);
//purchase.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default purchase;
