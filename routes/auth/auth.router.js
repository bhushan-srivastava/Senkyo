import { user_login, user_register } from '../../controllers/auth/auth.controller.js'

import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', user_login);

authRouter.post('/register', user_register);

export default authRouter 