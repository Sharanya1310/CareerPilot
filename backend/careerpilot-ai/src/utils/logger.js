/**
 * Logger Utility
 * Structured logging with timestamp and log levels.
 * Easy to swap with Winston, Pino, or any logger later.
 */

const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const getTimestamp = () => new Date().toISOString();

const formatLog = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const prefix = `[${timestamp}] [${level}]`;

  if (data) {
    return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
  }
  return `${prefix} ${message}`;
};

export const logger = {
  error: (message, data) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, data));
  },

  warn: (message, data) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, data));
  },

  info: (message, data) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, data));
  },

  debug: (message, data) => {
    if (process.env.NODE_ENV === "development") {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, data));
    }
  },
};
