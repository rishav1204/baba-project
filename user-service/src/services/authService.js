import { ValidationError } from '../utils/Error.js';
import { PasswordUtil } from '../utils/passwordUtility.js';
import { TokenUtil } from '../utils/Token.js';
import User from '../database/models/User.js';

export class AuthService {
  static async signupWithEmail({ email, password, confirmPassword, headers }) {
    // Check if passwords match
    if (password !== confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Get device info from headers
    const deviceId = headers['x-device-id'] || 
                    headers['x-fingerprint'] || 
                    headers['user-agent']?.replace(/\s/g, '') || 
                    null;
    const currentVersion = headers['x-app-version'] || '1.0.0';
    const now = new Date();

    // Hash password
    const hashedPassword = await PasswordUtil.hashPassword(password);

    // Create new user with all required fields
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName: email.split('@')[0],
      deviceId,
      lastActive: now,
      lastLoggedIn: now,
      webLastLoggedIn: headers['x-platform'] === 'web' ? now : null,
      currentVersion,
      loggedInType: 'EMAIL',
      emailVerified: false,
      isVerified: false,
      isActive: true,
      isDeleted: false,
      // createdAt and updatedAt are automatically handled by mongoose timestamps
    });

    // Generate token
    const token = TokenUtil.generateToken(user);

    // Return user data with token
    return {
      user: user.toJSON(), // This will include createdAt and updatedAt
      token
    };
  }
}