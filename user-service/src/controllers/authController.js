import { AuthService } from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuthController {
  static async signupWithEmail(req, res, next) {
    try {
      const { email, password, confirmPassword } = req.body;
      
      const user = await AuthService.signupWithEmail({ 
        email, 
        password, 
        confirmPassword,
        headers: req.headers
      });
      
      return ApiResponse.success(res, {
        message: 'Signup successful',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}