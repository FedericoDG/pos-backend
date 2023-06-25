import { Router } from 'express';

const price = Router();

// Controller
import { create /* remove */ } from '../controllers/cost.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCostSchema } from '../schemas/cost.schema';

// Routes
price.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createCostSchema)], create);
// price.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default price;
