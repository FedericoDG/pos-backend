import { Router } from 'express';

const price = Router();

// Controller
import { create, createManyPercentage, remove } from '../controllers/price.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createPriceSchema, createPriceManyPercentageSchema } from '../schemas/price.schema';

// Routes
price.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createPriceSchema)], create);
price.post(
  '/many-percentage',
  [validToken, accessLevel('ADMIN'), schemaValidator(createPriceManyPercentageSchema)],
  createManyPercentage,
);
price.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default price;
