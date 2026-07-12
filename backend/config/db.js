import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Clean surrounding quotes and whitespaces (bulletproof cloud sanitization)
    if (mongoUri) {
      mongoUri = mongoUri.trim().replace(/^["']|["']$/g, '');
    }

    // Safe startup diagnostic log (does NOT leak credentials)
    const exists = !!mongoUri;
    const isSrv = exists && mongoUri.startsWith('mongodb+srv://');
    const isNormal = exists && mongoUri.startsWith('mongodb://');
    const uriLength = exists ? mongoUri.length : 0;

    logger.info(`[DB DIAGNOSTIC] MONGO_URI exists: ${exists} | startsWith srv: ${isSrv} | startsWith normal: ${isNormal} | length: ${uriLength}`);

    if (!exists) {
      throw new Error('MONGO_URI is undefined or empty.');
    }

    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
