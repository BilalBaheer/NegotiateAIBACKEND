const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionController');
// const { authenticateToken } = require('../middleware/auth');

// Disabled authentication for testing
// router.use(authenticateToken);

// Email suggestion routes
router.post('/email', suggestionController.generateEmailSuggestions);

// Chat suggestion routes
router.post('/chat', suggestionController.generateChatSuggestions);

module.exports = router;
