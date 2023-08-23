import { Router } from 'express';

const otherTribute = Router();

// Controller
import { getAll } from '../controllers/otherTribute.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
otherTribute.get('/', [validToken, accessLevel('USER')], getAll);

export default otherTribute;
