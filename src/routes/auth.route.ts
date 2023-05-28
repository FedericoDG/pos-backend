import { Router } from 'express';

const auth = Router();

// Controller
import { login, loginClient } from '../controllers/auth.controller';

// Middlewares
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { clientExist, userExist } from '../middlewares/userPrivileges.middleware';

// Schema
import { loginSchema } from '../schemas/auth.schema';

// Routes
auth.post('/login', [schemaValidator(loginSchema), userExist], login);
auth.post('/client-login', [schemaValidator(loginSchema), clientExist], loginClient);

export default auth;
