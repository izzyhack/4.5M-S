require('dotenv').config();

const config = {
  // Git configuration
  git: {
    userName: process.env.GIT_USER_NAME || '4.5M-S Bot',
    userEmail: process.env.GIT_USER_EMAIL || 'bot@4.5m-s.com',
    commitMessagePrefix: process.env.GIT_COMMIT_MESSAGE_PREFIX || 'Daily Quote Commit:'
  },

  // Timer configuration (convert minutes to milliseconds)
  timer: {
    commitInterval: (parseFloat(process.env.COMMIT_INTERVAL) || 4.5) * 60 * 1000,
    randomDelayMax: parseInt(process.env.RANDOM_DELAY_MAX) || 30
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/quotes.log'
  },

  // Quote configuration
  quotes: {
    perCommit: parseInt(process.env.QUOTES_PER_COMMIT) || 1
  },

  // System configuration
  system: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 3000
  }
};

module.exports = config;