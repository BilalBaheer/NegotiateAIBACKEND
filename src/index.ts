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
