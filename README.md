# NegotiateAI Backend API

This is the backend API service for the NegotiateAI application, providing endpoints for user authentication, negotiation text analysis, and feedback collection.

## Features

- User authentication (register, login, profile management)
- Negotiation text analysis using OpenAI GPT-4
- Improved negotiation text generation
- Feedback collection and statistics
- MongoDB database for data persistence
- JWT authentication

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- OpenAI API
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables by creating a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/negotiateai
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=development
   ```
4. Build the TypeScript code:
   ```
   npm run build
   ```
5. Start the server:
   ```
   npm start
   ```
   
   For development with hot-reloading:
   ```
   npm run dev
   ```

## Deployment

### Deploying to Render.com

1. Create a Render.com account at https://render.com/

2. Connect your GitHub repository to Render:
   - Go to Dashboard > New > Web Service
   - Connect your GitHub account
   - Select the NegotiateAI repository

3. Configure your web service:
   - Name: negotiateai-api
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Select the appropriate plan (Free tier works for testing)

4. Add environment variables:
   - MONGODB_URI: Your MongoDB connection string (MongoDB Atlas recommended for production)
   - JWT_SECRET: A secure random string for JWT token signing
   - OPENAI_API_KEY: Your OpenAI API key
   - NODE_ENV: Set to "production"
   - PORT: Set to 10000 (Render will override this with its own PORT)

5. Click "Create Web Service"

Your API will be deployed to a URL like `https://negotiateai-api.onrender.com`. Use this URL as your production API endpoint for the Chrome extension.

### Alternative Deployment Options

- **Heroku**: Similar to Render but requires a credit card even for free tier
- **DigitalOcean App Platform**: Good for scaling, starts at $5/month
- **AWS Elastic Beanstalk**: More complex but highly scalable
- **Google Cloud Run**: Serverless option with pay-per-use pricing

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Analysis

- `POST /api/analysis` - Create a new analysis (protected)
- `GET /api/analysis` - Get all analyses for the current user (protected)
- `GET /api/analysis/:id` - Get a specific analysis by ID (protected)
- `DELETE /api/analysis/:id` - Delete an analysis (protected)
- `POST /api/analysis/improve` - Get improved version of negotiation text (protected)

### Feedback

- `POST /api/feedback` - Submit feedback for an analysis (protected)
- `GET /api/feedback` - Get all feedback for the current user (protected)
- `GET /api/feedback/stats` - Get feedback statistics (protected)

### Health Check

- `GET /api/health` - Check API health status

## Chrome Extension Integration

The NegotiateAI Chrome extension connects to this backend API to provide real-time negotiation suggestions within Gmail. To configure the extension for production:

1. Update the API endpoints in the extension code:
   ```javascript
   // In background.js and popup.js
   const API_BASE_URL = 'https://your-deployed-api-url.com'; // e.g., https://negotiateai-api.onrender.com
   ```

2. Update the web application URLs:
   ```javascript
   // In popup.js
   const SIGNUP_URL = 'https://negotiateai.com/signup';
   const DASHBOARD_URL = 'https://negotiateai.com/dashboard';
   ```

3. Remove localhost permissions from manifest.json before publishing to Chrome Web Store.

## Authentication

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Success Responses

Successful responses follow this format:

```json
{
  "success": true,
  "data": { ... }
}
```

## Development

For development, you can use the following npm scripts:

- `npm run dev` - Start the server with nodemon for hot-reloading
- `npm run build` - Build the TypeScript code
- `npm start` - Start the server from the built code

## License

[MIT](LICENSE)
