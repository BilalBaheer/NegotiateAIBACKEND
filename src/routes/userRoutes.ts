import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
