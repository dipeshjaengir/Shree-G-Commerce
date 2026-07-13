import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

// Fail-Fast: Verify required environment variables exist immediately
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'COOKIE_EXPIRES_IN'];
REQUIRED_ENV.forEach(key => {
  if (!process.env[key]) {
    console.error(`FATAL STARTUP FAILURE: Required environment variable "${key}" is missing.`);
    process.exit(1);
  }
});

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import { initializeSettings } from './services/settingsService.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { requestLogger } from './middlewares/loggingMiddleware.js';

// Import Versioned Router
import v1Router from './routes/v1Router.js';

// Uncaught Exception Handler
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! Shutting down... Details: ${err.message}`, {
    stack: err.stack
  });
  process.exit(1);
});

import User from './models/User.js';

// Initialize Express App
const app = express();

// 1. Connect to Database & Bootstrap settings
connectDB().then(async () => {
  initializeSettings();
  
  // Ensure default super admin exists (One-time bootstrap bootstrap mechanism only)
  try {
    const adminEmail = 'dipeshjangir12@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const superAdmin = new User({
        name: 'Dipesh Jangir',
        email: adminEmail,
        password: 'dipesh1234.@',
        phone: '9876543210',
        role: 'super_admin'
      });
      await superAdmin.save();
      logger.info('Default Super Admin account created successfully.');
    } else {
      logger.info('Super Admin already exists. Seeder skipped.');
    }
  } catch (err) {
    logger.error(`Failed to seed default Super Admin: ${err.message}`);
  }
});

// 2. Global Middlewares
app.use(helmet()); // Secure HTTP headers

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CLIENT_URL 
      ? process.env.CLIENT_URL.split(',').map(o => o.trim()) 
      : [];

    const isAllowed = allowedOrigins.includes(origin) || 
                      allowedOrigins.includes('*') ||
                      origin.startsWith('http://localhost:') || 
                      origin.startsWith('http://127.0.0.1:') ||
                      origin.endsWith('.onrender.com') ||
                      origin.endsWith('.netlify.app') ||
                      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};
app.use(cors(corsOptions));

app.use(cookieParser()); // Cookie parser
app.use(express.json({ limit: '10kb' })); // Body parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize()); // Prevent NoSQL query injection

// Request ID logger middleware
app.use(requestLogger);

// Rate Limiter
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', globalRateLimiter);

// 3. Mount Versioned Router
app.use('/api/v1', v1Router);
app.use('/api', v1Router); // Backward compatibility mount

// 4. Global 404 Route Handler
app.all('*', (req, res, next) => {
  const err = new Error(`Resource ${req.originalUrl} (${req.method}) not found on this server.`);
  err.statusCode = 404;
  next(err);
});

// 5. Global Error Handler Middleware
app.use(errorHandler);

// Helper to format and print all mounted Express routes for diagnostics
const printAllRoutes = (app) => {
  const routes = [];
  
  function split(thing) {
    if (typeof thing === 'string') {
      return thing;
    } else if (thing.fast_slash) {
      return '';
    } else {
      const regexStr = thing.toString().replace(/^\/|\/[a-z]*$/gi, '');
      const match = regexStr.match(/^\^?\\\/([a-zA-Z0-9_\\\/-]+?)(?:\\\/\?)?(?=\\\/\?|\(\?=\\\/\|\$\)|$)/);
      return match ? match[1].replace(/\\/g, '') : '';
    }
  }

  function print(path, layer) {
    if (layer.route) {
      layer.route.stack.forEach((stack) => {
        const method = stack.method ? stack.method.toUpperCase() : 'ALL';
        routes.push(`${method} ${path}${layer.route.path}`);
      });
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach((subLayer) => {
        print(path + '/' + split(layer.regexp), subLayer);
      });
    }
  }

  app._router.stack.forEach((layer) => {
    print('', layer);
  });
  
  const cleanRoutes = [...new Set(routes)]
    .map(r => r.replace(/\/+/g, '/'))
    .filter(r => r.includes('/api'));
    
  logger.info(`Mounted Express API routes:\n${cleanRoutes.map(r => `  - ${r}`).join('\n')}`);
};

// Listen to Port
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  try {
    printAllRoutes(app);
  } catch (err) {
    logger.error(`Failed to print routes: ${err.message}`);
  }
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forceful shutdown triggered. Exiting...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled Promise Rejections Handler
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! Shutting down... Details: ${err.message}`, {
    stack: err.stack
  });
  server.close(() => {
    process.exit(1);
  });
});
