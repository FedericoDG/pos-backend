import { Router } from 'express';

const afip = Router();

// Controller
import { create, creditNote, editSettings, settings } from '../controllers/afip.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { afipEditSttingsSchema } from '../schemas/afip.schema';

// Routes
afip.get('/settings/', [validToken, accessLevel('SUPERADMIN')], settings);
afip.put('/settings/', [validToken, accessLevel('SUPERADMIN'), schemaValidator(afipEditSttingsSchema)], editSettings);
afip.post('/', [validToken, accessLevel('SELLER')], create);
afip.post('/nota-credito', [validToken, accessLevel('ADMIN')], creditNote);

export default afip;
