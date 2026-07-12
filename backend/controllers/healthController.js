import mongoose from 'mongoose';
import storageService from '../services/storageService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const checkHealth = async (req, res, next) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    const databaseStatus = dbStatusMap[dbState] || 'unknown';
    const isDbConnected = dbState === 1;

    // Node & Memory usage details
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const nodeVersion = process.version;
    const memoryLimit = 1.5 * 1024 * 1024 * 1024; // 1.5GB soft limit for V8
    const heapPercentage = parseFloat(((memoryUsage.heapUsed / memoryLimit) * 100).toFixed(2));

    // Calculate Health Score dynamically
    let healthScore = 100;
    if (!isDbConnected) healthScore -= 50;
    if (heapPercentage > 85) healthScore -= 25;
    
    const appStatus = healthScore >= 75 ? 'healthy' : healthScore >= 50 ? 'degraded' : 'critical';

    const healthData = {
      status: appStatus,
      database: databaseStatus,
      storageProvider: storageService.provider,
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      nodeVersion,
      uptime: `${parseFloat(uptime.toFixed(1))}s`,
      memoryUsage: {
        rss: `${(memoryUsage.rss / (1024 * 1024)).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB`,
        heapLimitPercentage: `${heapPercentage}%`
      },
      healthScore,
      timestamp: new Date().toISOString()
    };

    const statusCode = appStatus === 'healthy' ? 200 : 503;
    return sendSuccess(res, statusCode, 'System health report compiled.', healthData);
  } catch (error) {
    next(error);
  }
};
