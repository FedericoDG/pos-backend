import { Router } from 'express';

const purchase = Router();

// Controller
import {
  checkCart,
  create,
  createCreditNote,
  getAll,
  getAllDetails,
  getById,
} from '../controllers/cashMovement.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createCashMovementsSchema } from '../schemas/cashMovement.schema';
import { userExistMidd } from '../middlewares/checkCart';

// Routes
purchase.get('/', [validToken, accessLevel('ADMIN')], getAll);
purchase.get('/iva', [validToken, accessLevel('ADMIN')], getAllDetails);
purchase.get('/:id', [validToken, accessLevel('DRIVER')], getById);
purchase.post(
  '/',
  [validToken, accessLevel('DRIVER'), schemaValidator(createCashMovementsSchema), userExistMidd],
  create,
);
purchase.post('/nota-credito', [validToken, accessLevel('DRIVER')], createCreditNote);
purchase.post('/check-cart', [validToken, accessLevel('DRIVER')], checkCart);

export default purchase;
