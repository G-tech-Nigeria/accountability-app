// Centralized logging utility for better console management

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn', 
  INFO: 'info',
  DEBUG: 'debug'
};

// Set this to control what gets logged
let CURRENT_LOG_LEVEL = LOG_LEVELS.ERROR; // Only show errors by default

const shouldLog = (level) => {
  const levels = Object.values(LOG_LEVELS);
  const currentIndex = levels.indexOf(CURRENT_LOG_LEVEL);
  const messageIndex = levels.indexOf(level);
  return messageIndex <= currentIndex;
};

export const logger = {
  error: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.WARN)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  info: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.INFO)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  debug: (message, ...args) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  
  // For database errors specifically
  dbError: (operation, error) => {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      console.error(`[DB ERROR] Failed to ${operation}:`, error);
    }
  },
  
  // For real-time events
  realtime: (event, payload) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(`[REALTIME] ${event}:`, payload);
    }
  }
};

// Set log level (call this to change what gets logged)
export const setLogLevel = (level) => {
  if (Object.values(LOG_LEVELS).includes(level)) {
    CURRENT_LOG_LEVEL = level;
  }
};

// Enable debug mode (shows all logs)
export const enableDebugMode = () => {
  setLogLevel(LOG_LEVELS.DEBUG);
};

// Disable all logs except errors
export const disableLogs = () => {
  setLogLevel(LOG_LEVELS.ERROR);
};
