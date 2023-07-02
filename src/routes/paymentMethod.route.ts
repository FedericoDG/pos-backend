import { Router } from 'express';

const paymentMethods = Router();

// Controller
import { getAll } from '../controllers/paymentMethod.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Routes
paymentMethods.get('/', [validToken, accessLevel('SELLER')], getAll);

export default paymentMethods;
