import { Router } from 'express';

const settings = Router();

// Controller
import { getById, update } from '../controllers/settings.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { updateSettingsSchema } from '../schemas/settings.schema';

// Routes
settings.get('/:id', [validToken, accessLevel('USER')], getById);
settings.put('/:id', [validToken, accessLevel('ADMIN'), schemaValidator(updateSettingsSchema)], update);

export default settings;
