import jwt from 'jsonwebtoken';
import config from '../config/config';
import { IUser } from '../models/User';

/**
 * Generate a JWT token for authentication
 * @param user User object
 * @returns JWT token
 */
const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role 
    },
    config.jwtSecret,
    {
      expiresIn: '30d'
    }
  );
};

export default generateToken;
