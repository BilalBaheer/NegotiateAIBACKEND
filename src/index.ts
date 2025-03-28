import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database';
import config from './config/config';
import { errorHandler, CustomError } from './middleware/error';

// Import routes
import userRoutes from './routes/userRoutes';
import analysisRoutes from './routes/analysisRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import suggestionRoutes from './routes/suggestionRoutes';

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // Allow requests from any origin (including Chrome extensions)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for Chrome extension compatibility
}));

// Root route - Welcome page
app.get('/', (req: Request, res: Response) => {
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
        
        <p><small>Server running in ${config.nodeEnv} mode | ${new Date().toISOString()}</small></p>
      </body>
    </html>
  `);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/suggestions', suggestionRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
