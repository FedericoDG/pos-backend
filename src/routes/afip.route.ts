import { Router } from 'express';

const afip = Router();

// Controller
import { create, creditNote, settings } from '../controllers/afip.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';

// Schema

// Routes
afip.get('/parametros/', [validToken, accessLevel('SUPERADMIN')], settings);
afip.post('/', [validToken, accessLevel('SELLER')], create);
afip.post('/nota-credito', [validToken, accessLevel('ADMIN')], creditNote);

export default afip;
