import express from "express";

import { AuthController } from "../../controllers/index.js";
import { validateSignup, validateGoogleSignup } from "../../middlewares/validationMiddleware.js";
const router = express.Router();

router.post(
  "/auth/signup/email",
  validateSignup,
  AuthController.signupWithEmail
);
router.post('/auth/signup/google', validateGoogleSignup, AuthController.signupWithGoogle); /*-> authRoutes*/
export default router;
