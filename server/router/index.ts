import { Router } from 'express';
import { userController } from '../controllers/UserController';
const router: Router = Router();

import { registrationValidators } from '../validators/user';
import { authMiddleware } from '../middleware/authMiddleware';

router.post('/registration', registrationValidators, userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

export { router };