"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = __importDefault(require("./config/database"));
const config_1 = __importDefault(require("./config/config"));
const error_1 = require("./middleware/error");
// Import routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const analysisRoutes_1 = __importDefault(require("./routes/analysisRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const suggestionRoutes_1 = __importDefault(require("./routes/suggestionRoutes"));
// Connect to MongoDB
(0, database_1.default)();
// Initialize Express app
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: '*', // Allow requests from any origin (including Chrome extensions)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false // Disable CSP for Chrome extension compatibility
}));
// Root route - Welcome page
app.get('/', (req, res) => {
    res.status(200).send(`
    <html>
      <head>
        <title>NegotiateAI API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          .endpoint {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          .method {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 3px;
            color: white;
            font-weight: bold;
            margin-right: 10px;
          }
          .get { background-color: #61affe; }
          .post { background-color: #49cc90; }
        </style>
      </head>
      <body>
        <h1>NegotiateAI API</h1>
        <p>Welcome to the NegotiateAI API server. This API provides endpoints for the NegotiateAI Chrome extension.</p>
        
        <h2>Available Endpoints:</h2>
        
        <div class="endpoint">
          <span class="method get">GET</span>
          <strong>/api/health</strong> - Check API health status
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span>
          <strong>/api/users/login</strong> - User authentication
        </div>
        
        <div class="endpoint">
          <span class="method post">POST</span>
          <strong>/api/suggestions/email</strong> - Get email suggestions
        </div>
        
        <p>For more information, please refer to the API documentation.</p>
        
        <p><small>Server running in ${config_1.default.nodeEnv} mode | ${new Date().toISOString()}</small></p>
      </body>
    </html>
  `);
});
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/analysis', analysisRoutes_1.default);
app.use('/api/feedback', feedbackRoutes_1.default);
app.use('/api/suggestions', suggestionRoutes_1.default);
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running',
        environment: config_1.default.nodeEnv,
        timestamp: new Date().toISOString()
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    (0, error_1.errorHandler)(err, req, res, next);
});
// Start server
const PORT = config_1.default.port;
app.listen(PORT, () => {
    console.log(`Server running in ${config_1.default.nodeEnv} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});
