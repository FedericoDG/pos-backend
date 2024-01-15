import { Router } from 'express';

const afip = Router();

// Controller
import { create, creditNote, editSettings, settings, siteSettings } from '../controllers/afip.controller';

// Middlewares
import { accessLevel, validToken } from '../middlewares/auth.middleware';
import { schemaValidator } from '../middlewares/schemaValidator.middleware';

// Schema
import { afipEditSttingsSchema } from '../schemas/afip.schema';

// Routes
afip.get('/settings/', [validToken, accessLevel('DRIVER')], settings);
afip.get('/site-settings/', [validToken, accessLevel('DRIVER')], siteSettings);
afip.put('/settings/', [validToken, accessLevel('SUPERADMIN'), schemaValidator(afipEditSttingsSchema)], editSettings);
afip.post('/', [validToken, accessLevel('SELLER')], create);
afip.post('/nota-credito', [validToken, accessLevel('SELLER')], creditNote);

export default afip;
