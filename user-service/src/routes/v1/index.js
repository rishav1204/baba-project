import express from "express";

import { AuthController } from "../../controllers/index.js";
import { validateSignup } from "../../middlewares/validationMiddleware.js";
const router = express.Router();

router.post(
  "auth/signup/email",
  validateSignup,
  AuthController.signupWithEmail
);
export default router;
