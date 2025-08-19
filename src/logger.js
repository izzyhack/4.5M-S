/**
 * Logger Module - Centralized logging for the 4.5M-S Quote Committer System
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Ensure logs directory exists
const logDir = path.dirname(config.logging.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    // File transport
    new winston.transports.File({
      filename: config.logging.file,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ]
});

// System metrics tracking
const metrics = {
  commitsCount: 0,
  errorsCount: 0,
  startTime: new Date(),
  lastCommitTime: null,
  lastErrorTime: null
};

/**
 * Log a successful quote commit
 * @param {Object} quote - The quote that was committed
 * @param {string} commitHash - Git commit hash
 */
function logQuoteCommit(quote, commitHash) {
  metrics.commitsCount++;
  metrics.lastCommitTime = new Date();
  
  logger.info(`Quote committed successfully`, {
    quote: quote.text.substring(0, 50) + '...',
    author: quote.author,
    category: quote.category,
    commitHash: commitHash,
    totalCommits: metrics.commitsCount
  });
}

/**
 * Log an error with context
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
function logError(error, context = 'Unknown') {
  metrics.errorsCount++;
  metrics.lastErrorTime = new Date();
  
  logger.error(`Error in ${context}`, {
    error: error.message,
    stack: error.stack,
    context,
    totalErrors: metrics.errorsCount
  });
}

/**
 * Log system startup
 */
function logStartup() {
  logger.info('4.5M-S Quote Committer System starting up', {
    nodeEnv: config.system.nodeEnv,
    commitInterval: config.timer.commitInterval / 60000 + ' minutes',
    logLevel: config.logging.level
  });
}

/**
 * Log system shutdown
 */
function logShutdown(signal) {
  const uptime = Date.now() - metrics.startTime.getTime();
  logger.info(`4.5M-S Quote Committer System shutting down`, {
    signal,
    uptime: Math.floor(uptime / 1000) + ' seconds',
    totalCommits: metrics.commitsCount,
    totalErrors: metrics.errorsCount
  });
}

/**
 * Get system metrics
 * @returns {Object} System metrics
 */
function getMetrics() {
  return {
    ...metrics,
    uptime: Date.now() - metrics.startTime.getTime()
  };
}

/**
 * Log periodic health check
 */
function logHealthCheck() {
  const uptime = Math.floor((Date.now() - metrics.startTime.getTime()) / 1000);
  logger.info('System health check', {
    uptime: uptime + ' seconds',
    commits: metrics.commitsCount,
    errors: metrics.errorsCount,
    memoryUsage: process.memoryUsage(),
    lastCommit: metrics.lastCommitTime ? metrics.lastCommitTime.toISOString() : 'Never'
  });
}

module.exports = {
  logger,
  logQuoteCommit,
  logError,
  logStartup,
  logShutdown,
  logHealthCheck,
  getMetrics
};