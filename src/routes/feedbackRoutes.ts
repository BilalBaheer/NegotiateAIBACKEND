import express from 'express';
import { 
  submitFeedback, 
  getFeedback, 
  getFeedbackStats 
} from '../controllers/feedbackController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.route('/')
  .post(protect, submitFeedback)
  .get(protect, getFeedback);

router.get('/stats', protect, getFeedbackStats);

export default router;
