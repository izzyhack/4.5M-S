#!/usr/bin/env node

/**
 * Autonomous Tech Quote Committer
 * 
 * A high-frequency automated system that commits technology and innovation
 * quotes to a git repository every 4.5 milliseconds.
 * 
 * WARNING: 4.5ms intervals result in ~222 commits per second, which may
 * overwhelm git hosting services and is not recommended for production use.
 */

const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const winston = require('winston');
const QuotesDatabase = require('./quotes-database');

// Load environment configuration
require('dotenv').config();

class AutonomousQuoteCommitter {
  constructor() {
    this.quotesDb = new QuotesDatabase();
    this.setupLogger();
    this.setupGit();
    this.setupConfiguration();
    this.commitCount = 0;
    this.startTime = Date.now();
    this.isRunning = false;
    this.intervalId = null;

    // Performance tracking
    this.stats = {
      totalCommits: 0,
      successfulCommits: 0,
      failedCommits: 0,
      averageCommitTime: 0,
      commitTimes: []
    };
  }

  /**
   * Setup Winston logger for comprehensive logging
   */
  setupLogger() {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? '\n' + stack : ''}`;
      })
    );

    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            logFormat
          )
        }),
        new winston.transports.File({
          filename: process.env.LOG_FILE || 'logs/quote-committer.log',
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
          tailable: true
        })
      ]
    });
  }

  /**
   * Setup git configuration
   */
  setupGit() {
    const repoPath = process.env.REPO_PATH || process.cwd();
    this.git = simpleGit(repoPath);
    
    // Configure git user
    const userName = process.env.GIT_USER_NAME || 'Quote Committer Bot';
    const userEmail = process.env.GIT_USER_EMAIL || 'quotes@example.com';
    
    this.git.addConfig('user.name', userName);
    this.git.addConfig('user.email', userEmail);
    
    this.logger.info(`Git configured with user: ${userName} <${userEmail}>`);
  }

  /**
   * Setup application configuration
   */
  setupConfiguration() {
    // Check if running in development mode
    const devMode = process.env.DEV_MODE === 'true' || process.argv.includes('--dev');
    
    if (devMode) {
      this.commitInterval = parseInt(process.env.DEV_INTERVAL) || 5000; // 5 seconds default for dev
      this.logger.warn(`Running in DEVELOPMENT mode with ${this.commitInterval}ms interval`);
    } else {
      this.commitInterval = parseFloat(process.env.COMMIT_INTERVAL) || 4.5;
      this.logger.warn(`Running with ${this.commitInterval}ms interval - This is EXTREMELY high frequency!`);
      this.logger.warn('Consider using --dev flag for testing or adjusting COMMIT_INTERVAL');
    }

    this.autoPush = process.env.AUTO_PUSH === 'true';
    this.maxCycles = parseInt(process.env.MAX_QUOTE_CYCLES) || 1000;

    // Validate interval
    if (this.commitInterval < 1) {
      this.logger.error('Commit interval cannot be less than 1ms');
      process.exit(1);
    }

    this.logger.info(`Configuration: interval=${this.commitInterval}ms, autoPush=${this.autoPush}, maxCycles=${this.maxCycles}`);
  }

  /**
   * Update quote.txt with a new quote and commit it
   */
  async commitNewQuote() {
    const startTime = Date.now();
    
    try {
      // Get next quote
      const quote = this.quotesDb.getNextQuote();
      const formattedQuote = this.quotesDb.formatQuote(quote);
      
      // Write quote to file
      const quotePath = path.join(process.cwd(), 'quote.txt');
      fs.writeFileSync(quotePath, formattedQuote + '\n', 'utf8');
      
      // Stage and commit
      await this.git.add('quote.txt');
      
      const commitMessage = `Add tech quote #${this.commitCount + 1}: ${quote.author} - ${quote.category}`;
      await this.git.commit(commitMessage);
      
      this.commitCount++;
      this.stats.totalCommits++;
      this.stats.successfulCommits++;
      
      // Track performance
      const commitTime = Date.now() - startTime;
      this.stats.commitTimes.push(commitTime);
      
      // Keep only last 100 commit times for average calculation
      if (this.stats.commitTimes.length > 100) {
        this.stats.commitTimes.shift();
      }
      
      this.stats.averageCommitTime = this.stats.commitTimes.reduce((a, b) => a + b, 0) / this.stats.commitTimes.length;
      
      // Auto push if enabled (be very careful with this at high frequency)
      if (this.autoPush && this.commitCount % 10 === 0) { // Push every 10 commits
        try {
          await this.git.push();
          this.logger.debug(`Pushed commits (batch ${Math.floor(this.commitCount / 10)})`);
        } catch (pushError) {
          this.logger.error(`Push failed: ${pushError.message}`);
        }
      }
      
      // Log periodically to avoid overwhelming logs
      if (this.commitCount % 100 === 0) {
        this.logStats();
      }
      
      this.logger.debug(`Committed quote #${this.commitCount}: "${quote.text.substring(0, 50)}..." (${commitTime}ms)`);
      
    } catch (error) {
      this.stats.failedCommits++;
      this.logger.error(`Failed to commit quote: ${error.message}`);
      
      // If we're having consistent failures, slow down
      if (this.stats.failedCommits > 10 && this.stats.failedCommits / this.stats.totalCommits > 0.5) {
        this.logger.error('High failure rate detected, stopping committer');
        this.stop();
      }
    }
  }

  /**
   * Log current statistics
   */
  logStats() {
    const runtime = (Date.now() - this.startTime) / 1000;
    const rate = this.commitCount / runtime;
    
    this.logger.info(`Stats: ${this.stats.successfulCommits} successful, ${this.stats.failedCommits} failed, ` +
      `${rate.toFixed(2)} commits/sec, avg commit time: ${this.stats.averageCommitTime.toFixed(2)}ms`);
  }

  /**
   * Start the autonomous quote committer
   */
  start() {
    if (this.isRunning) {
      this.logger.warn('Quote committer is already running');
      return;
    }

    this.logger.info(`Starting Autonomous Tech Quote Committer...`);
    this.logger.info(`Database loaded with ${this.quotesDb.getTotalCount()} quotes`);
    this.logger.info(`Categories: ${this.quotesDb.getCategories().join(', ')}`);
    
    // Warn about high frequency
    if (this.commitInterval < 1000) {
      this.logger.warn('⚠️  HIGH FREQUENCY WARNING: Very short intervals may overwhelm git and hosting services');
      this.logger.warn('⚠️  Monitor system resources and git repository health');
    }

    this.isRunning = true;
    this.startTime = Date.now();

    // Start the commit loop
    this.intervalId = setInterval(() => {
      this.commitNewQuote();
      
      // Stop after max cycles to prevent infinite operation
      if (this.commitCount >= this.maxCycles) {
        this.logger.info(`Reached maximum cycles (${this.maxCycles}), stopping`);
        this.stop();
      }
    }, this.commitInterval);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.logger.info('Received SIGINT, shutting down gracefully...');
      this.stop();
    });

    process.on('SIGTERM', () => {
      this.logger.info('Received SIGTERM, shutting down gracefully...');
      this.stop();
    });
  }

  /**
   * Stop the autonomous quote committer
   */
  stop() {
    if (!this.isRunning) {
      this.logger.warn('Quote committer is not running');
      return;
    }

    this.logger.info('Stopping Autonomous Tech Quote Committer...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    this.logStats();
    
    // Final push if auto-push is enabled
    if (this.autoPush && this.commitCount > 0) {
      this.git.push()
        .then(() => {
          this.logger.info('Final push completed');
          this.shutdown();
        })
        .catch(error => {
          this.logger.error(`Final push failed: ${error.message}`);
          this.shutdown();
        });
    } else {
      this.shutdown();
    }
  }

  /**
   * Complete shutdown
   */
  shutdown() {
    const runtime = (Date.now() - this.startTime) / 1000;
    this.logger.info(`Quote Committer stopped. Runtime: ${runtime.toFixed(2)}s, Total commits: ${this.commitCount}`);
    process.exit(0);
  }

  /**
   * Get current status information
   */
  getStatus() {
    const runtime = (Date.now() - this.startTime) / 1000;
    const rate = runtime > 0 ? this.commitCount / runtime : 0;
    
    return {
      running: this.isRunning,
      commitCount: this.commitCount,
      runtime: runtime,
      commitsPerSecond: rate,
      stats: this.stats,
      interval: this.commitInterval,
      totalQuotes: this.quotesDb.getTotalCount()
    };
  }
}

// Initialize and start if run directly
if (require.main === module) {
  const committer = new AutonomousQuoteCommitter();
  
  // Handle command line arguments
  if (process.argv.includes('--status')) {
    console.log(JSON.stringify(committer.getStatus(), null, 2));
    process.exit(0);
  }
  
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Autonomous Tech Quote Committer

Usage:
  node quote-committer.js [options]

Options:
  --dev          Run in development mode (5 second intervals)
  --status       Show current status
  --help, -h     Show this help message

Environment Variables:
  COMMIT_INTERVAL   Interval between commits in milliseconds (default: 4.5)
  DEV_MODE          Set to 'true' for development mode
  DEV_INTERVAL      Interval for development mode (default: 5000ms)
  AUTO_PUSH         Set to 'true' to enable automatic pushing
  LOG_LEVEL         Logging level (debug, info, warn, error)
  
WARNING: The default 4.5ms interval results in ~222 commits per second.
This is extremely high frequency and not recommended for production use.
Use --dev flag for testing with reasonable intervals.
    `);
    process.exit(0);
  }
  
  committer.start();
}

module.exports = AutonomousQuoteCommitter;