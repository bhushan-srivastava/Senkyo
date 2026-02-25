import { loadCurrentUser } from '../../controllers/auth/authHelper.js';
import { userLogin, userRegister, adminLogin, logout } from '../../controllers/auth/authentication.controller.js'
import { requireAuth, getAuth } from '../../controllers/auth/authorization.controller.js';
import { Router } from 'express';

const authRouter = Router();

authRouter.route('/').get(requireAuth, loadCurrentUser, getAuth)

authRouter.route('/admin/login').post(adminLogin)

authRouter.route('/voter/register').post(userRegister)
authRouter.route('/voter/login').post(userLogin)

authRouter.route('/logout').get(logout).post(logout)

export default authRouter
