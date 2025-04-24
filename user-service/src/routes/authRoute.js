import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateSignup, validateGoogleSignup } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Auth Routes - No authentication required
router.post('/signup/email', validateSignup, AuthController.signupWithEmail); /*-> authRoutes*/ 
router.post('/signup/google', validateGoogleSignup, AuthController.signupWithGoogle); /*-> authRoutes*/

export default router;