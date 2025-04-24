import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateSignup } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Auth Routes - No authentication required
router.post('/signup/email', validateSignup, AuthController.signupWithEmail); /*-> authRoutes*/ 
router.post('/signup/google', AuthController.signupWithGoogle); /*-> authRoutes*/

export default router;