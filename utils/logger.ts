import winston from 'winston';
import path from 'path';

// Generate timestamp for log filenames
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                  new Date().toISOString().split('T')[1].replace(/[:.]/g, '-').slice(0, -5);

// Define custom log levels for test automation
const customLevels = {
  levels: {
    fail: 0,
    error: 1,
    warn: 2,
    info: 3,
    pass: 4,
    success: 5,
    debug: 6,
    trace: 7,
  },
  colors: {
    fail: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    pass: 'green',
    success: 'green',
    debug: 'gray',
    trace: 'magenta',
  },
};

// Create logger with custom levels
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'trace',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: path.join('logs', `combined-${timestamp}.log`) }),
    new winston.transports.File({ filename: path.join('logs', `error-${timestamp}.log`), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', `fail-${timestamp}.log`), level: 'fail' }),
  ],
});

// Add colors to logger
winston.addColors(customLevels.colors);

// Typed logger methods for better API
export const log = {
  fail: (message: string) => logger.log('fail', message),
  error: (message: string) => logger.error(message),
  warn: (message: string) => logger.warn(message),
  info: (message: string) => logger.info(message),
  pass: (message: string) => logger.log('pass', message),
  success: (message: string) => logger.log('success', message),
  debug: (message: string) => logger.debug(message),
  trace: (message: string) => logger.log('trace', message),
};

export default logger;