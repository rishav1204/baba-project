import jwt from 'jsonwebtoken';

export class TokenUtil {
  static generateToken(user) {
    return jwt.sign(
      { 
        id: user._id,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
  }
}