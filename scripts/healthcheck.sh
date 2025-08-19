#!/bin/bash

# 4.5M-S Quote Committer System Health Check Script
# Used by Docker healthcheck and monitoring

NODE_BIN="${NODE_BIN:-node}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# Check if Node.js application is running
check_process() {
    if pgrep -f "node.*index.js" > /dev/null; then
        echo "✓ Process is running"
        return 0
    else
        echo "✗ Process is not running"
        return 1
    fi
}

# Check if logs are being written (recent activity)
check_logs() {
    LOG_FILE="$APP_DIR/logs/quotes.log"
    
    if [ ! -f "$LOG_FILE" ]; then
        echo "✗ Log file not found"
        return 1
    fi
    
    # Check if log file was modified in the last 10 minutes
    if find "$LOG_FILE" -mmin -10 | grep -q .; then
        echo "✓ Recent log activity detected"
        return 0
    else
        echo "⚠ No recent log activity"
        return 1
    fi
}

# Check memory usage
check_memory() {
    # Get memory usage of the node process
    MEMORY_KB=$(pgrep -f "node.*index.js" | head -1 | xargs ps -o rss= -p)
    
    if [ -n "$MEMORY_KB" ]; then
        MEMORY_MB=$((MEMORY_KB / 1024))
        echo "✓ Memory usage: ${MEMORY_MB}MB"
        
        # Alert if memory usage is over 500MB
        if [ "$MEMORY_MB" -gt 500 ]; then
            echo "⚠ High memory usage detected"
            return 1
        fi
        
        return 0
    else
        echo "✗ Cannot determine memory usage"
        return 1
    fi
}

# Main health check
main() {
    echo "=== 4.5M-S Quote Committer System Health Check ==="
    echo "Timestamp: $(date)"
    echo
    
    local exit_code=0
    
    # Run checks
    if ! check_process; then
        exit_code=1
    fi
    
    if ! check_memory; then
        exit_code=1
    fi
    
    if ! check_logs; then
        # Don't fail health check just for logs
        true
    fi
    
    echo
    if [ $exit_code -eq 0 ]; then
        echo "✓ Health check passed"
    else
        echo "✗ Health check failed"
    fi
    
    exit $exit_code
}

# Run health check
main "$@"