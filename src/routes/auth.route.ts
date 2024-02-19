import { Router } from 'express';

const auth = Router();

// Controller
import { login, loginClient, loginDriver } from '../controllers/auth.controller';

// Middlewares
import { schemaValidator } from '../middlewares/schemaValidator.middleware';
import { clientExist, driverExist, userExist } from '../middlewares/userPrivileges.middleware';

// Schema
import { loginSchema } from '../schemas/auth.schema';

// Routes
auth.post('/login', [schemaValidator(loginSchema), userExist], login);
auth.post('/client-login', [schemaValidator(loginSchema), clientExist], loginClient);
auth.post('/driver-login', [schemaValidator(loginSchema), driverExist], loginDriver);

export default auth;
