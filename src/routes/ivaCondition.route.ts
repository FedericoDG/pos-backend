import { Router } from 'express';

const ivaCondition = Router();

// Controller
import { getAll } from '../controllers/ivaCondition.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
ivaCondition.get('/', [validToken, accessLevel('USER')], getAll);

export default ivaCondition;
