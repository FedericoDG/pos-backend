import { Router } from 'express';

const identification = Router();

// Controller
import { getAll } from '../controllers/identification.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
identification.get('/', [validToken, accessLevel('USER')], getAll);

export default identification;
