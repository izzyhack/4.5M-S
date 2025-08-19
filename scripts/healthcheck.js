/**
 * Health check script for Docker container
 * Simple Node.js version of the health check
 */

const { quoteSystem } = require('../src/index');
const { logger } = require('../src/logger');

async function healthCheck() {
  try {
    // Check if system is running
    if (!quoteSystem.isRunning) {
      console.error('System is not running');
      process.exit(1);
    }

    // Get system status
    const status = await quoteSystem.getStatus();
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    if (memoryMB > 500) {
      console.warn(`High memory usage: ${memoryMB}MB`);
    }
    
    console.log('Health check passed');
    console.log(`Uptime: ${Math.round(status.uptime)}s`);
    console.log(`Memory: ${memoryMB}MB`);
    console.log(`Running: ${status.isRunning}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('Health check failed:', error.message);
    process.exit(1);
  }
}

// Set timeout for health check
setTimeout(() => {
  console.error('Health check timeout');
  process.exit(1);
}, 5000);

healthCheck();