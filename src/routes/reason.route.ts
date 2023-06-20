import { Router } from 'express';

const reason = Router();

// Controller
import { create, getAll, getById, remove, update } from '../controllers/reason.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createReasonSchema, updateReasonSchema } from '../schemas/reason.schema';

// Routes
reason.get('/', [validToken, accessLevel('CLIENT')], getAll);
reason.get('/:id', [validToken, accessLevel('CLIENT')], getById);
reason.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createReasonSchema)], create);
reason.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateReasonSchema)], update);
reason.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default reason;
