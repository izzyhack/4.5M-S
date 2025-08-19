#!/usr/bin/env node

/**
 * Test script for 4.5M-S Quote Committer System
 * Tests the core functionality without the timer
 */

const { getRandomQuote, formatQuote } = require('../src/quotes');
const GitManager = require('../src/gitManager');
const { logger, logStartup, logQuoteCommit } = require('../src/logger');

async function testSystem() {
  console.log('=== 4.5M-S Quote Committer System Test ===');
  console.log();

  try {
    // Test 1: Quote system
    console.log('✓ Testing quote system...');
    const quote = getRandomQuote();
    console.log(`  Random quote: "${quote.text.substring(0, 50)}..." - ${quote.author}`);
    console.log(`  Category: ${quote.category}`);
    console.log(`  Formatted: ${formatQuote(quote).split('\n')[0].substring(0, 50)}...`);
    console.log();

    // Test 2: Logger system
    console.log('✓ Testing logger system...');
    logStartup();
    logger.info('Test log message');
    console.log('  Logs written to logs/quotes.log');
    console.log();

    // Test 3: Git Manager (initialize only, don't commit)
    console.log('✓ Testing git manager...');
    const gitManager = new GitManager();
    await gitManager.initialize();
    
    const status = await gitManager.getStatus();
    console.log(`  Current branch: ${status.current}`);
    console.log(`  Repository is clean: ${status.files.length === 0}`);
    
    const repoInfo = await gitManager.getRepoInfo();
    console.log(`  Latest commit: ${repoInfo.latestCommit ? repoInfo.latestCommit.message.substring(0, 50) + '...' : 'None'}`);
    console.log();

    // Test 4: Environment configuration
    console.log('✓ Testing configuration...');
    const config = require('../src/config');
    console.log(`  Commit interval: ${config.timer.commitInterval / 60000} minutes`);
    console.log(`  Git user: ${config.git.userName} <${config.git.userEmail}>`);
    console.log(`  Log level: ${config.logging.level}`);
    console.log();

    console.log('🎉 All tests passed! System is ready to run.');
    console.log();
    console.log('To start the system:');
    console.log('  npm start');
    console.log();
    console.log('To test with Docker:');
    console.log('  docker-compose up -d');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testSystem().catch(console.error);
}

module.exports = testSystem;