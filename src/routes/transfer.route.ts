import { Router } from 'express';

const category = Router();

// Controller
import { create, getAll, getById } from '../controllers/transfer.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createTransferSchema } from '../schemas/transfer.schema';

// Routes
category.get('/', [validToken, accessLevel('CLIENT')], getAll);
category.get('/:id', [validToken, accessLevel('CLIENT')], getById);
category.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createTransferSchema)], create);

export default category;
