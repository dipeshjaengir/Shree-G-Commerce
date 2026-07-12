import crypto from 'crypto';
import { apiLogger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  // Generate unique Request ID
  req.id = crypto.randomUUID();
  const startTime = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = parseFloat(((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(2));

    const logData = {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      userId: req.user ? req.user._id.toString() : 'anonymous',
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      method: req.method,
      endpoint: req.originalUrl,
      durationMs,
      statusCode: res.statusCode
    };

    apiLogger.info(
      `[${logData.requestId}] ${logData.method} ${logData.endpoint} ${logData.statusCode} - ${logData.durationMs}ms | User: ${logData.userId} | IP: ${logData.ip}`,
      logData
    );
  });

  next();
};
