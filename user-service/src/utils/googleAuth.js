import { OAuth2Client } from 'google-auth-library';
import { ValidationError } from './Error.js';

export class GoogleAuthUtil {
  static client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  static async verifyToken(token) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      return {
        googleId: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lName: payload.family_name,
        profilePic: payload.picture,
        emailVerified: payload.email_verified,
        locale: payload.locale,
        hd: payload.hd
      };
    } catch (error) {
      throw new ValidationError('Invalid Google token');
    }
  }
}