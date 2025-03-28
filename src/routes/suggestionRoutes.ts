import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import * as suggestionController from '../controllers/suggestionController';
// import { authenticateToken } from '../middleware/auth';

// Disabled authentication for testing
// router.use(authenticateToken);

// Email suggestion routes
router.post('/email', (req: Request, res: Response, next: NextFunction) => {
  suggestionController.generateEmailSuggestions(req, res).catch(next);
});

// Chat suggestion routes
router.post('/chat', (req: Request, res: Response, next: NextFunction) => {
  suggestionController.generateChatSuggestions(req, res).catch(next);
});

export default router;
