import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
    return;
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, config.jwtSecret);

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
    return;
  }
};

// Admin middleware
export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin'
    });
    return;
  }
};
