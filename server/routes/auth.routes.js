import express from 'express';
import { register, login, logout, forgotPassword, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.get('/me', authMiddleware, getMe);

export default router;
