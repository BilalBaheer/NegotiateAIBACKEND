import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user)
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Authenticate user & get token
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user)
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        },
        token: generateToken(updatedUser)
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};
