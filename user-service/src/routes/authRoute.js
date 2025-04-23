import express from 'express';

const router = express.Router();

// Auth Routes - No authentication required
router.post('/signup/email', authController.signupWithEmail); /*-> authRoutes*/ 
router.post('/signup/google', authController.signupWithGoogle); /*-> authRoutes*/

export default router;