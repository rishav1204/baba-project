import { ValidationError } from '../utils/Error.js';
import { PasswordUtil } from '../utils/passwordUtility.js';
import { TokenUtil } from '../utils/Token.js';
import User from '../database/models/User.js';
import { GoogleAuthUtil } from '../utils/googleAuth.js';

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

  static async signupWithGoogle({ token, headers, location }) {
    const googleUserInfo = await GoogleAuthUtil.verifyToken(token);
    
    let user = await User.findOne({ googleId: googleUserInfo.googleId });
    
    if (!user) {
      user = await User.findOne({ email: googleUserInfo.email });
    }
  
    const deviceId = headers['x-device-id'] || 
                    headers['x-fingerprint'] || 
                    headers['user-agent']?.replace(/\s/g, '') || 
                    null;
    const currentVersion = headers['x-app-version'] || '1.0.0';
    const now = new Date();
  
    if (user) {
      user.googleId = googleUserInfo.googleId;
      user.emailVerified = true;
      user.isVerified = true;
      user.lastLoggedIn = now;
      user.lastActive = now;
      if (headers['x-platform'] === 'web') {
        user.webLastLoggedIn = now;
      }
      user.deviceId = deviceId;
      user.currentVersion = currentVersion;
      user.loggedInType = 'GOOGLE';
      if (location) {
        user.location = location;
      }
      
      await user.save();
    } else {
      user = await User.create({
        ...googleUserInfo,
        location,
        deviceId,
        lastActive: now,
        lastLoggedIn: now,
        webLastLoggedIn: headers['x-platform'] === 'web' ? now : null,
        currentVersion,
        loggedInType: 'GOOGLE',
        emailVerified: true,
        isVerified: true,
        isActive: true,
        isDeleted: false
      });
    }
  
    const authToken = TokenUtil.generateToken(user);
  
    return {
      user: user.toJSON(),
      token: authToken
    };
  }
}