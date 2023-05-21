import { Router } from 'express';

import { login } from '../controllers/auth';

const auth = Router();

auth.get('/login', [], login);

export default auth;
