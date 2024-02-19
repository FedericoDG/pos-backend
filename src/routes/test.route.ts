import { Router } from 'express';

const afip = Router();

// Controller
import { test } from '../controllers/test.controller';

// Routes
afip.get('/', [], test);

export default afip;
