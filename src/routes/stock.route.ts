import { Router } from 'express';

const stock = Router();

// Controller
import { getAll, getById, remove } from '../controllers/stock.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
stock.get('/', [validToken, accessLevel('USER')], getAll);
stock.get('/:id', [validToken, accessLevel('USER')], getById);
stock.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default stock;
