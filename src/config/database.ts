import mongoose from 'mongoose';
import config from './config';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing with mock database');
  }
};

export default connectDB;
