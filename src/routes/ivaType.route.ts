import { Router } from 'express';

const ivaType = Router();

// Controller
import { getAll } from '../controllers/ivaType.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
ivaType.get('/', [validToken, accessLevel('USER')], getAll);

export default ivaType;
