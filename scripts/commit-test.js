#!/usr/bin/env node

/**
 * Single commit test - performs one quote commit to test the full workflow
 */

const { getRandomQuote } = require('../src/quotes');
const GitManager = require('../src/gitManager');
const { logger } = require('../src/logger');

async function singleCommitTest() {
  console.log('=== Testing Single Quote Commit ===');

  try {
    // Get a random quote
    const quote = getRandomQuote();
    console.log(`Selected quote: "${quote.text}" - ${quote.author} [${quote.category}]`);
    
    // Initialize git manager
    const gitManager = new GitManager();
    await gitManager.initialize();
    
    // Perform the commit
    console.log('Committing quote to repository...');
    const commitHash = await gitManager.commitQuote(quote);
    
    console.log(`✅ Success! Commit hash: ${commitHash}`);
    console.log(`Quote committed: "${quote.text.substring(0, 50)}..." - ${quote.author}`);
    
  } catch (error) {
    console.error('❌ Commit test failed:', error.message);
    logger.error('Single commit test failed', { error: error.message });
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  singleCommitTest().catch(console.error);
}

module.exports = singleCommitTest;