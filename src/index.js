/**
 * 4.5M-S Quote Committer System
 * Main application entry point
 * 
 * Automatically commits inspiring tech/innovation/philosophy quotes
 * every 4.5 minutes with proper error handling and monitoring
 */

const config = require('./config');
const { getRandomQuote } = require('./quotes');
const GitManager = require('./gitManager');
const { 
  logger, 
  logStartup, 
  logShutdown, 
  logQuoteCommit, 
  logError, 
  logHealthCheck 
} = require('./logger');

class QuoteCommitterSystem {
  constructor() {
    this.gitManager = new GitManager();
    this.isRunning = false;
    this.commitTimer = null;
    this.healthCheckTimer = null;
    this.retryAttempts = 0;
    this.maxRetryAttempts = 3;
  }

  /**
   * Initialize the system
   */
  async initialize() {
    try {
      logStartup();
      
      // Initialize git manager
      await this.gitManager.initialize();
      
      // Log repository information
      const repoInfo = await this.gitManager.getRepoInfo();
      logger.info('Repository information', repoInfo);
      
      // Set up process event handlers
      this.setupProcessHandlers();
      
      logger.info('4.5M-S Quote Committer System initialized successfully');
      
    } catch (error) {
      logError(error, 'QuoteCommitterSystem.initialize');
      throw error;
    }
  }

  /**
   * Start the quote committing system
   */
  async start() {
    try {
      if (this.isRunning) {
        logger.warn('System is already running');
        return;
      }

      await this.initialize();
      
      this.isRunning = true;
      
      // Start the commit timer
      this.scheduleNextCommit();
      
      // Start health check timer (every 30 minutes)
      this.healthCheckTimer = setInterval(() => {
        logHealthCheck();
      }, 30 * 60 * 1000);
      
      // Commit initial quote immediately
      await this.commitRandomQuote();
      
      logger.info('4.5M-S Quote Committer System started', {
        commitInterval: config.timer.commitInterval / 60000 + ' minutes',
        nextCommit: new Date(Date.now() + config.timer.commitInterval).toISOString()
      });

    } catch (error) {
      logError(error, 'QuoteCommitterSystem.start');
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Stop the quote committing system
   */
  stop(signal = 'MANUAL') {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Clear timers
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
      this.commitTimer = null;
    }

    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    logShutdown(signal);
    logger.info('4.5M-S Quote Committer System stopped');
  }

  /**
   * Schedule the next commit with random delay
   */
  scheduleNextCommit() {
    if (!this.isRunning) return;

    // Add random delay (0 to maxDelay seconds) to avoid predictable timing
    const randomDelay = Math.floor(Math.random() * config.timer.randomDelayMax * 1000);
    const totalDelay = config.timer.commitInterval + randomDelay;

    this.commitTimer = setTimeout(async () => {
      await this.commitRandomQuote();
      this.scheduleNextCommit(); // Schedule next commit
    }, totalDelay);

    const nextCommitTime = new Date(Date.now() + totalDelay);
    logger.debug('Next commit scheduled', {
      scheduledTime: nextCommitTime.toISOString(),
      delayMinutes: totalDelay / 60000
    });
  }

  /**
   * Commit a random quote to the repository
   */
  async commitRandomQuote() {
    try {
      // Get a random quote
      const quote = getRandomQuote();
      
      logger.info('Preparing to commit quote', {
        text: quote.text.substring(0, 100) + '...',
        author: quote.author,
        category: quote.category
      });

      // Commit the quote
      const commitHash = await this.gitManager.commitQuote(quote);
      
      // Log successful commit
      logQuoteCommit(quote, commitHash);
      
      // Reset retry attempts on success
      this.retryAttempts = 0;

    } catch (error) {
      logError(error, 'QuoteCommitterSystem.commitRandomQuote');
      
      // Implement retry logic for network issues
      this.retryAttempts++;
      
      if (this.retryAttempts <= this.maxRetryAttempts) {
        const retryDelay = Math.min(1000 * Math.pow(2, this.retryAttempts), 60000); // Exponential backoff, max 1 minute
        
        logger.warn(`Retrying commit in ${retryDelay/1000} seconds`, {
          attempt: this.retryAttempts,
          maxAttempts: this.maxRetryAttempts
        });
        
        setTimeout(async () => {
          await this.commitRandomQuote();
        }, retryDelay);
        
      } else {
        logger.error('Max retry attempts reached, will try again on next scheduled commit');
        this.retryAttempts = 0;
      }
    }
  }

  /**
   * Set up process event handlers for graceful shutdown
   */
  setupProcessHandlers() {
    // Handle various shutdown signals
    const shutdownSignals = ['SIGTERM', 'SIGINT', 'SIGUSR1', 'SIGUSR2'];
    
    shutdownSignals.forEach(signal => {
      process.on(signal, () => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        this.stop(signal);
        process.exit(0);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logError(error, 'UncaughtException');
      logger.error('Uncaught Exception - shutting down system');
      this.stop('UNCAUGHT_EXCEPTION');
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', {
        reason: reason,
        promise: promise
      });
      logError(new Error(reason), 'UnhandledRejection');
    });
  }

  /**
   * Get system status
   * @returns {Object} System status information
   */
  async getStatus() {
    try {
      const repoInfo = await this.gitManager.getRepoInfo();
      const recentCommits = await this.gitManager.getRecentCommits(5);
      
      return {
        isRunning: this.isRunning,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        retryAttempts: this.retryAttempts,
        nextCommit: this.commitTimer ? new Date(Date.now() + config.timer.commitInterval).toISOString() : null,
        repository: repoInfo,
        recentCommits: recentCommits.map(commit => ({
          hash: commit.hash,
          message: commit.message,
          date: commit.date,
          author: commit.author_name
        }))
      };
    } catch (error) {
      logError(error, 'QuoteCommitterSystem.getStatus');
      throw error;
    }
  }
}

// Create and export system instance
const quoteSystem = new QuoteCommitterSystem();

// Auto-start if this file is run directly
if (require.main === module) {
  quoteSystem.start().catch(error => {
    console.error('Failed to start 4.5M-S Quote Committer System:', error);
    process.exit(1);
  });
}

module.exports = { QuoteCommitterSystem, quoteSystem };