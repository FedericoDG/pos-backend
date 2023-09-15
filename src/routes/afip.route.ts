import { Router } from 'express';

const afip = Router();

// Controller
import { settings } from '../controllers/afip.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
afip.get('/parametros/', [validToken, accessLevel('SUPERADMIN')], settings);

export default afip;
