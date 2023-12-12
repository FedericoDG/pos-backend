import { Router } from 'express';

const stock = Router();

// Controller
import { getAll, getByWarehouseId, getByWarehouseIdAndProductId, remove } from '../controllers/stock.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
stock.get('/', [validToken, accessLevel('USER')], getAll);
stock.get('/:id', [validToken, accessLevel('USER')], getByWarehouseId);
stock.post('/:id', [validToken, accessLevel('USER')], getByWarehouseIdAndProductId);
stock.delete('/:id', [validToken, accessLevel('ADMIN')], remove);

export default stock;
