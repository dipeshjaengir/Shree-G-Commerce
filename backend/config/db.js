import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      // 1. Diagnostic: Extract prefix and mask credentials safely
      let prefix = mongoUri.substring(0, 35);
      const credentialsMatch = prefix.match(/\/\/(.+?)@/);
      if (credentialsMatch) {
        prefix = prefix.replace(credentialsMatch[1], '****:****');
      }

      // 2. Diagnostic: Get character codes of the first 15 characters to catch invisible Unicode bugs
      const charCodes = [];
      for (let i = 0; i < Math.min(15, mongoUri.length); i++) {
        charCodes.push(mongoUri.charCodeAt(i));
      }

      logger.info(`[DB DIAGNOSTIC] MONGO_URI prefix: ${prefix} | CharCodes: ${charCodes.join(', ')} | Length: ${mongoUri.length}`);

      // 3. Robust Extraction: Bypass BOM markers, prefix keys, quotes, or whitespace
      const match = mongoUri.match(/(mongodb(?:\+srv)?:\/\/.+)/i);
      if (match) {
        mongoUri = match[1];
      }

      // 4. Final sanitization
      mongoUri = mongoUri.trim().replace(/^["']|["']$/g, '');
    }

    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
