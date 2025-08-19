/**
 * Git Manager - Handle all git operations with error handling
 * 4.5M-S Automated Quote Committer System
 */

const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { logger, logError } = require('./logger');

class GitManager {
  constructor(repoPath = process.cwd()) {
    this.git = simpleGit(repoPath);
    this.repoPath = repoPath;
    this.initialized = false;
  }

  /**
   * Initialize git configuration
   */
  async initialize() {
    try {
      // Set git user configuration
      await this.git.addConfig('user.name', config.git.userName);
      await this.git.addConfig('user.email', config.git.userEmail);
      
      // Check if we're in a git repository
      const isRepo = await this.git.checkIsRepo();
      if (!isRepo) {
        throw new Error('Not in a git repository');
      }

      this.initialized = true;
      logger.info('Git manager initialized', {
        repoPath: this.repoPath,
        userName: config.git.userName,
        userEmail: config.git.userEmail
      });

    } catch (error) {
      logError(error, 'GitManager.initialize');
      throw error;
    }
  }

  /**
   * Check repository status
   * @returns {Object} Git status
   */
  async getStatus() {
    try {
      const status = await this.git.status();
      return status;
    } catch (error) {
      logError(error, 'GitManager.getStatus');
      throw error;
    }
  }

  /**
   * Add files to staging
   * @param {string|Array} files - Files to add
   */
  async addFiles(files = '.') {
    try {
      await this.git.add(files);
      logger.debug('Files added to staging', { files });
    } catch (error) {
      logError(error, 'GitManager.addFiles');
      throw error;
    }
  }

  /**
   * Commit changes with a message
   * @param {string} message - Commit message
   * @returns {string} Commit hash
   */
  async commit(message) {
    try {
      const fullMessage = `${config.git.commitMessagePrefix} ${message}`;
      const result = await this.git.commit(fullMessage);
      
      logger.debug('Changes committed', {
        message: fullMessage,
        hash: result.commit
      });

      return result.commit;
    } catch (error) {
      logError(error, 'GitManager.commit');
      throw error;
    }
  }

  /**
   * Push changes to remote
   * @param {string} remote - Remote name (default: origin)
   * @param {string} branch - Branch name (default: current branch)
   */
  async push(remote = 'origin', branch = null) {
    try {
      if (!branch) {
        // Get current branch name
        const status = await this.git.status();
        branch = status.current;
      }

      await this.git.push(remote, branch);
      
      logger.debug('Changes pushed to remote', {
        remote,
        branch
      });

    } catch (error) {
      logError(error, 'GitManager.push');
      throw error;
    }
  }

  /**
   * Write quote to file and commit
   * @param {Object} quote - Quote object
   * @param {string} filename - Filename to write to
   * @returns {string} Commit hash
   */
  async commitQuote(quote, filename = 'quote.txt') {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const filePath = path.join(this.repoPath, filename);
      const quoteContent = `${quote.text}\n- ${quote.author}\n`;
      
      // Write quote to file
      fs.writeFileSync(filePath, quoteContent, 'utf8');
      
      // Stage the file
      await this.addFiles(filename);
      
      // Create commit message
      const commitMessage = `"${quote.text.substring(0, 50)}..." - ${quote.author} [${quote.category}]`;
      
      // Commit the changes
      const commitHash = await this.commit(commitMessage);
      
      // Push to remote (with error handling for network issues)
      try {
        await this.push();
        logger.info('Quote successfully committed and pushed', {
          quote: quote.text.substring(0, 100),
          author: quote.author,
          commitHash,
          filename
        });
      } catch (pushError) {
        logger.warn('Failed to push to remote, but commit successful', {
          commitHash,
          error: pushError.message
        });
        // Don't throw here - commit was successful, push failure is non-critical
      }

      return commitHash;

    } catch (error) {
      logError(error, 'GitManager.commitQuote');
      throw error;
    }
  }

  /**
   * Get the latest commits
   * @param {number} count - Number of commits to retrieve
   * @returns {Array} Array of commit objects
   */
  async getRecentCommits(count = 10) {
    try {
      const log = await this.git.log({ maxCount: count });
      return log.all;
    } catch (error) {
      logError(error, 'GitManager.getRecentCommits');
      throw error;
    }
  }

  /**
   * Check if there are uncommitted changes
   * @returns {boolean} True if there are changes
   */
  async hasChanges() {
    try {
      const status = await this.git.status();
      return status.files.length > 0;
    } catch (error) {
      logError(error, 'GitManager.hasChanges');
      return false;
    }
  }

  /**
   * Get repository information
   * @returns {Object} Repository info
   */
  async getRepoInfo() {
    try {
      const remotes = await this.git.getRemotes(true);
      const status = await this.git.status();
      const latestCommit = await this.git.log({ maxCount: 1 });
      
      return {
        currentBranch: status.current,
        remotes: remotes,
        latestCommit: latestCommit.latest,
        hasChanges: status.files.length > 0
      };
    } catch (error) {
      logError(error, 'GitManager.getRepoInfo');
      throw error;
    }
  }
}

module.exports = GitManager;