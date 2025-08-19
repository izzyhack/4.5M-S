#!/usr/bin/env node

/**
 * Simple test runner for the Autonomous Tech Quote Committer
 * Tests basic functionality without performing actual git operations
 */

const path = require('path');
const fs = require('fs');

// Test colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async runTests() {
    console.log('🧪 Running Autonomous Tech Quote Committer Tests\n');

    for (const test of this.tests) {
      try {
        await test.testFn();
        console.log(`${colors.green}✅ ${test.name}${colors.reset}`);
        this.passed++;
      } catch (error) {
        console.log(`${colors.red}❌ ${test.name}${colors.reset}`);
        console.log(`   ${colors.red}Error: ${error.message}${colors.reset}`);
        this.failed++;
      }
    }

    console.log('\n📊 Test Results:');
    console.log(`${colors.green}Passed: ${this.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${this.failed}${colors.reset}`);
    console.log(`Total: ${this.passed + this.failed}`);

    return this.failed === 0;
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  assertGreaterThan(actual, expected, message) {
    if (actual <= expected) {
      throw new Error(message || `Expected ${actual} to be greater than ${expected}`);
    }
  }
}

const runner = new TestRunner();

// Test QuotesDatabase
runner.test('QuotesDatabase loads correctly', () => {
  const QuotesDatabase = require('../src/quotes-database');
  const db = new QuotesDatabase();
  
  runner.assertGreaterThan(db.getTotalCount(), 0, 'Database should have quotes');
  runner.assert(Array.isArray(db.getCategories()), 'Categories should be an array');
  runner.assertGreaterThan(db.getCategories().length, 0, 'Should have categories');
});

runner.test('QuotesDatabase getNextQuote works', () => {
  const QuotesDatabase = require('../src/quotes-database');
  const db = new QuotesDatabase();
  
  const quote1 = db.getNextQuote();
  const quote2 = db.getNextQuote();
  
  runner.assert(quote1.text, 'Quote should have text');
  runner.assert(quote1.author, 'Quote should have author');
  runner.assert(quote1.category, 'Quote should have category');
  runner.assert(quote2.text, 'Second quote should have text');
});

runner.test('QuotesDatabase formatQuote works', () => {
  const QuotesDatabase = require('../src/quotes-database');
  const db = new QuotesDatabase();
  
  const quote = { text: 'Test quote', author: 'Test Author', category: 'test' };
  const formatted = db.formatQuote(quote);
  
  runner.assert(formatted.includes('Test quote'), 'Formatted quote should include text');
  runner.assert(formatted.includes('Test Author'), 'Formatted quote should include author');
});

runner.test('QuotesDatabase getQuotesByCategory works', () => {
  const QuotesDatabase = require('../src/quotes-database');
  const db = new QuotesDatabase();
  
  const categories = db.getCategories();
  const firstCategory = categories[0];
  const categoryQuotes = db.getQuotesByCategory(firstCategory);
  
  runner.assertGreaterThan(categoryQuotes.length, 0, 'Should have quotes in category');
  runner.assertEqual(categoryQuotes[0].category, firstCategory, 'Quote should match category');
});

runner.test('AutonomousQuoteCommitter can be imported', () => {
  const AutonomousQuoteCommitter = require('../src/quote-committer');
  runner.assert(typeof AutonomousQuoteCommitter === 'function', 'Should be a constructor function');
});

runner.test('Project structure is correct', () => {
  const requiredFiles = [
    'package.json',
    'src/quotes-database.js',
    'src/quote-committer.js',
    'Dockerfile',
    'docker-compose.yml',
    'setup.sh',
    '.env.example',
    '.gitignore'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file);
    runner.assert(fs.existsSync(filePath), `${file} should exist`);
  }
});

runner.test('Package.json has required dependencies', () => {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = ['simple-git', 'winston', 'dotenv'];
  
  for (const dep of requiredDeps) {
    runner.assert(packageJson.dependencies[dep], `${dep} should be in dependencies`);
  }
  
  runner.assert(packageJson.scripts.start, 'Should have start script');
  runner.assert(packageJson.scripts.dev, 'Should have dev script');
});

runner.test('Environment example file has required variables', () => {
  const envPath = path.join(__dirname, '..', '.env.example');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = ['COMMIT_INTERVAL', 'GIT_USER_NAME', 'LOG_LEVEL', 'DEV_MODE'];
  
  for (const variable of requiredVars) {
    runner.assert(envContent.includes(variable), `${variable} should be in .env.example`);
  }
});

// Run tests
if (require.main === module) {
  runner.runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

module.exports = TestRunner;