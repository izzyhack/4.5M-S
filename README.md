# 4.5M-S - Autonomous Tech Quote Committer

An autonomous system that commits new quotes about technology and innovation every 4.5 milliseconds to this repository.

## ⚠️ High-Frequency Warning

**The default 4.5ms interval results in approximately 222 commits per second!** This is extremely high frequency and is not recommended for production use with real git hosting services. It's primarily for demonstration purposes.

For practical use:
- Use development mode: `npm run dev` (5-second intervals)
- Adjust `COMMIT_INTERVAL` in `.env` to a reasonable value
- Consider the impact on git hosting service rate limits

## Features

🤖 **Autonomous Operation**: Runs continuously, committing new quotes at specified intervals  
📚 **Rich Quote Database**: 30+ carefully curated quotes about technology and innovation  
🔄 **High-Frequency Commits**: Configurable interval (default: 4.5ms)  
🐋 **Docker Ready**: Complete containerization with Docker and docker-compose  
🔧 **Multiple Deployment Options**: Docker, systemd service, or direct execution  
📊 **Performance Monitoring**: Built-in logging and statistics tracking  
⚙️ **Configurable**: Environment-based configuration with development mode  
🛡️ **Error Handling**: Robust error handling and graceful shutdown  

## Quote Categories

- Technology & Innovation
- Programming & Software Development  
- Artificial Intelligence
- Web Technology
- Data Science
- Digital Transformation
- Automation
- Computing Philosophy

## Quick Start

### Prerequisites

- Node.js 16+
- Git
- Docker (optional, for containerized deployment)

### Installation

1. **Clone and setup:**
   ```bash
   git clone <this-repository>
   cd 4.5M-S
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

### Running

**Development Mode (Recommended for testing):**
```bash
npm run dev
# Runs with 5-second intervals - safe for testing
```

**Production Mode (High Frequency - Use with caution):**
```bash
npm start
# Runs with 4.5ms intervals - VERY HIGH FREQUENCY!
```

**With custom configuration:**
```bash
COMMIT_INTERVAL=1000 DEV_MODE=false npm start
# Custom 1-second intervals
```

## Deployment Options

### 1. Docker (Recommended)

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f quote-committer
```

### 2. Systemd Service (Linux)

```bash
# Install service
sudo npm run install-service

# Start service
sudo systemctl start quote-committer
sudo systemctl enable quote-committer

# View logs
sudo journalctl -u quote-committer -f
```

### 3. Direct Execution

```bash
# Development mode
node src/quote-committer.js --dev

# Production mode
node src/quote-committer.js

# With custom settings
COMMIT_INTERVAL=2000 node src/quote-committer.js
```

## Configuration

Configuration is managed through environment variables. Copy `.env.example` to `.env` and modify:

| Variable | Default | Description |
|----------|---------|-------------|
| `COMMIT_INTERVAL` | 4.5 | Interval between commits (milliseconds) |
| `DEV_MODE` | false | Enable development mode (5s intervals) |
| `DEV_INTERVAL` | 5000 | Interval for development mode (ms) |
| `GIT_USER_NAME` | Quote Committer Bot | Git commit author name |
| `GIT_USER_EMAIL` | quotes@example.com | Git commit author email |
| `AUTO_PUSH` | false | Automatically push commits (use carefully) |
| `LOG_LEVEL` | info | Logging level (debug, info, warn, error) |
| `MAX_QUOTE_CYCLES` | 1000 | Maximum commits before stopping |

## Commands

```bash
npm start              # Start with production settings
npm run dev            # Start in development mode
npm test               # Run tests
npm run setup          # Run setup script
node src/quote-committer.js --help  # Show help
```

## Monitoring

- **Logs**: Check `logs/quote-committer.log`
- **Stats**: Periodic statistics in logs showing commit rate, success rate, etc.
- **Docker logs**: `docker-compose logs quote-committer`
- **Systemd logs**: `sudo journalctl -u quote-committer`

## Project Structure

```
4.5M-S/
├── src/
│   ├── quote-committer.js    # Main application
│   └── quotes-database.js    # Quote collection and management
├── test/
│   └── test-runner.js        # Test suite
├── systemd/
│   └── quote-committer.service  # Systemd service file
├── logs/                     # Log files (created at runtime)
├── Dockerfile                # Container configuration
├── docker-compose.yml        # Docker Compose setup
├── package.json              # Node.js dependencies
├── setup.sh                  # Installation script
├── .env.example              # Environment template
└── README.md                 # This file
```

## Technical Details

### Performance Characteristics

- **Commit frequency**: Up to 222 commits/second (4.5ms intervals)
- **Memory usage**: ~50-100MB typical
- **Git operation time**: ~20-100ms per commit depending on system
- **Database**: 30+ quotes with automatic cycling

### Safety Features

- **Graceful shutdown**: Handles SIGINT/SIGTERM properly
- **Error recovery**: Continues operation despite individual commit failures
- **Resource limits**: Configurable maximum cycles to prevent runaway operation  
- **Development mode**: Safe 5-second intervals for testing
- **Rate limiting**: Option to disable auto-push for manual control

### Git Integration

- Uses `simple-git` library for robust git operations
- Configurable git user identity
- Each commit contains a unique tech quote
- Structured commit messages with quote metadata
- Optional automatic pushing (disabled by default for safety)

## Contributing

To add more quotes to the database:

1. Edit `src/quotes-database.js`
2. Add quotes to the `this.quotes` array with format:
   ```javascript
   {
     text: "Quote text here",
     author: "Author Name", 
     category: "category-name"
   }
   ```
3. Run tests: `npm test`
4. Test with development mode: `npm run dev`

## Safety Warnings

⚠️ **Production Usage**: The 4.5ms interval creates extremely high commit frequency  
⚠️ **Git Hosting**: Most git hosting services have rate limits - use with caution  
⚠️ **System Resources**: High frequency operations consume CPU and I/O  
⚠️ **Repository Size**: Continuous commits will rapidly increase repository size  

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or questions:
1. Check the logs: `tail -f logs/quote-committer.log`
2. Run in development mode: `npm run dev`
3. Verify configuration in `.env`
4. Run tests: `npm test`
