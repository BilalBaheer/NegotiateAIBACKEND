import express from 'express';
import { 
  createAnalysis, 
  improveText, 
  getAnalyses, 
  getAnalysisById, 
  deleteAnalysis 
} from '../controllers/analysisController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.route('/')
  .post(protect, createAnalysis)
  .get(protect, getAnalyses);

router.post('/improve', protect, improveText);

router.route('/:id')
  .get(protect, getAnalysisById)
  .delete(protect, deleteAnalysis);

export default router;
