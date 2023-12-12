import { Router } from 'express';

const afip = Router();

// Controller
import { getAll } from '../controllers/states.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Routes
afip.get('/', [validToken, accessLevel('USER')], getAll);

export default afip;
