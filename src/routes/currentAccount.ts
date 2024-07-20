import { Router } from 'express';

const currentAccount = Router();

// Controller
import { createPaymnet, getById, getByIdAndDate, getRecibo } from '../controllers/currentAccount.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { createPayment } from '../schemas/currentAccount.schema';

// Routes
// currentAccount.get('/', [validToken, accessLevel('SELLER')], getAll);
currentAccount.get('/', [validToken, accessLevel('SELLER')], getByIdAndDate);
currentAccount.get('/recibo/:id', [validToken, accessLevel('SELLER')], getRecibo);
currentAccount.get('/:id', [validToken, accessLevel('SELLER')], getById);
currentAccount.post('/', [validToken, accessLevel('ADMIN'), schemaValidator(createPayment)], createPaymnet);

export default currentAccount;
