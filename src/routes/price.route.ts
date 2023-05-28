import { Router } from 'express';

const user = Router();

// Controller
import { create, remove } from '../controllers/price.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createPriceSchema } from '../schemas/price.schema';

// Routes
user.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createPriceSchema)], create);
user.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default user;
