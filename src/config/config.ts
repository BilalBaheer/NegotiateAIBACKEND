import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  openaiApiKey: string;
  nodeEnv: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/negotiateai',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;
