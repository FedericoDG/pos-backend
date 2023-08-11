import { Router } from 'express';

const purchase = Router();

// Controller
import { checkCart, create, getAll, getById } from '../controllers/cashMovement.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCashMovementsSchema } from '../schemas/cashMovement.schema';
import { userExistMidd } from 'src/middlewares/checkCart';

// Routes
purchase.get('/', [validToken, accessLevel('ADMIN')], getAll);
purchase.get('/:id', [validToken, accessLevel('ADMIN')], getById);
purchase.post(
  '/',
  [validToken, accessLevel('DRIVER'), schemaValidator(createCashMovementsSchema), userExistMidd],
  create,
);
purchase.post('/check-cart', [validToken, accessLevel('DRIVER')], checkCart);

export default purchase;
