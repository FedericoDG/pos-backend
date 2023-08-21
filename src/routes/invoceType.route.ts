import { Router } from 'express';

const invoceType = Router();

// Controller
import { getAll } from '../controllers/invoceType.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
invoceType.get('/', [validToken, accessLevel('USER')], getAll);

export default invoceType;
