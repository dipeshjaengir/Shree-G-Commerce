import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, '../logs');

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    api: 3,
    admin: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    api: 'cyan',
    admin: 'magenta'
  }
};

winston.addColors(customLevels.colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  })
);

// Logger creator helper
const createCustomLogger = (label, filename) => {
  return winston.createLogger({
    levels: customLevels.levels,
    level: 'admin', // log up to admin level
    format: logFormat,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          logFormat
        )
      }),
      new winston.transports.File({
        filename: path.join(logDirectory, filename),
        level: label
      })
    ]
  });
};

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'admin',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.File({ filename: path.join(logDirectory, 'app.log'), level: 'info' }),
    new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' })
  ]
});

export const apiLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'api',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.File({ filename: path.join(logDirectory, 'api.log'), level: 'api' })
  ]
});

export const adminLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'admin',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.File({ filename: path.join(logDirectory, 'admin.log'), level: 'admin' })
  ]
});
