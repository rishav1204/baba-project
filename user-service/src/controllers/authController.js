import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/authService.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { loginWithEmail } from "../services/authService.js";

export class AuthController {
  static async signupWithEmail(req, res, next) {
    try {
      const { email, password, confirmPassword } = req.body;

      const user = await AuthService.signupWithEmail({
        email,
        password,
        confirmPassword,
        headers: req.headers,
      });

      return ApiResponse.success(res, {
        message: "Signup successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const loginWithEmails = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginWithEmail({
    email,
    password,
    headers: req.headers,
  });

  return res.status(StatusCodes.OK).json({
    message: "Login successful",
    data: user,
  });
});
