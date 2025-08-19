# 4.5M-S

**Automated Quote Committer System** - Commits inspiring technology, philosophy, and innovation quotes every 4.5 minutes.

[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)

## 🚀 Overview

The 4.5M-S (4.5 Minute System) is an autonomous quote committer that automatically commits inspiring quotes about technology, philosophy, and innovation to your Git repository every 4.5 minutes. It's designed for continuous inspiration and maintaining an active commit history with meaningful content.

### ✨ Features

- 🕐 **Automated Commits**: Commits every 4.5 minutes with random delays
- 📚 **Rich Quote Database**: 30+ carefully curated quotes about tech and innovation
- 🔧 **Enterprise-Grade**: Production-ready with comprehensive logging and monitoring
- 🐳 **Docker Support**: Full containerization with Docker Compose
- ⚡ **SystemD Integration**: Linux service management
- 🛡️ **Error Handling**: Robust error handling with retry logic
- 📊 **Health Monitoring**: Built-in health checks and metrics
- 🔒 **Security**: Runs with minimal privileges and security hardening

## 📋 Requirements

- **Node.js** 16.0.0 or higher
- **Git** 2.0 or higher
- **Linux/macOS/Windows** (with WSL)
- **Docker** (optional, for containerized deployment)

## 🎯 Quick Start

### Method 1: Direct Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/izzyhack/4.5M-S.git
   cd 4.5M-S
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your preferences
   ```

4. **Start the system:**
   ```bash
   npm start
   ```

### Method 2: Automated Setup (Linux)

```bash
# Run the automated installer (requires sudo)
sudo bash scripts/setup.sh
```

### Method 3: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## ⚙️ Configuration

The system uses environment variables for configuration. Copy `.env.example` to `.env` and customize:

```env
# Git Configuration
GIT_USER_NAME=4.5M-S Bot
GIT_USER_EMAIL=bot@4.5m-s.com
GIT_COMMIT_MESSAGE_PREFIX=Daily Quote Commit:

# Timer Configuration (in minutes)
COMMIT_INTERVAL=4.5

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/quotes.log

# Quote Configuration
QUOTES_PER_COMMIT=1
RANDOM_DELAY_MAX=30
```

### Configuration Options

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `GIT_USER_NAME` | Git commit author name | `4.5M-S Bot` | `Quote Bot` |
| `GIT_USER_EMAIL` | Git commit author email | `bot@4.5m-s.com` | `bot@example.com` |
| `COMMIT_INTERVAL` | Minutes between commits | `4.5` | `5.0` |
| `LOG_LEVEL` | Logging verbosity | `info` | `debug` |
| `RANDOM_DELAY_MAX` | Max random delay (seconds) | `30` | `60` |

## 🏗️ Architecture

```
4.5M-S/
├── src/
│   ├── index.js          # Main application
│   ├── quotes.js         # Quote database
│   ├── gitManager.js     # Git operations
│   ├── logger.js         # Logging system
│   └── config.js         # Configuration
├── scripts/
│   ├── setup.sh          # Installation script
│   ├── healthcheck.sh    # Health monitoring
│   └── healthcheck.js    # Docker health check
├── config/
│   └── quotes.service    # SystemD service
├── logs/                 # Log files
├── Dockerfile           # Container image
├── docker-compose.yml   # Container orchestration
└── .env.example        # Environment template
```

## 📊 Monitoring & Logging

### Health Checks

```bash
# Manual health check
npm run health

# Check system status
scripts/healthcheck.sh
```

### Log Files

- **Application logs**: `logs/quotes.log`
- **System logs** (systemd): `journalctl -u quotes.service -f`
- **Docker logs**: `docker-compose logs -f`

### Metrics

The system tracks:
- Total commits made
- Error count and types
- System uptime
- Memory usage
- Last commit time

## 🐳 Docker Deployment

### Production Setup

1. **Build the image:**
   ```bash
   docker build -t 4.5m-s-quotes .
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Monitor:**
   ```bash
   docker-compose logs -f quote-committer
   ```

### Docker Commands

```bash
# Build and start
npm run docker:build
npm run docker:run

# Stop containers
npm run docker:stop

# View logs
npm run docker:logs
```

## 🔧 SystemD Service (Linux)

### Installation

```bash
# Automated installation
sudo bash scripts/setup.sh

# Manual service management
sudo systemctl enable quotes.service
sudo systemctl start quotes.service
```

### Service Management

```bash
# Check status
sudo systemctl status quotes.service

# View logs
sudo journalctl -u quotes.service -f

# Restart service
sudo systemctl restart quotes.service
```

## 📚 Quote Database

The system includes 30+ inspiring quotes in three categories:

- **Technology**: Quotes about tech innovation and digital transformation
- **Innovation**: Quotes about creativity, disruption, and progress  
- **Philosophy**: Quotes about thinking, learning, and wisdom

### Adding Custom Quotes

Edit `src/quotes.js` to add your own quotes:

```javascript
{
  text: "Your inspiring quote here",
  author: "Author Name", 
  category: "technology" // or "innovation" or "philosophy"
}
```

## 🛠️ Development

### Local Development

```bash
# Development mode with detailed logging
npm run dev

# Test health check
npm test
```

### Project Structure

- `src/index.js` - Main application with timer and orchestration
- `src/gitManager.js` - Git operations with error handling
- `src/quotes.js` - Quote database and selection logic
- `src/logger.js` - Centralized logging with Winston
- `src/config.js` - Environment configuration

## 🔒 Security

The system follows security best practices:

- Runs as non-root user (`nodejs`)
- Minimal file system permissions
- No network exposure (except optional monitoring)
- Secure logging without sensitive data
- Resource limits (memory, CPU)

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Fix file permissions
   sudo chown -R nodejs:nodejs /opt/4.5m-s
   ```

2. **Git Authentication**
   ```bash
   # Configure Git credentials
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   ```

3. **Service Won't Start**
   ```bash
   # Check logs
   sudo journalctl -u quotes.service --no-pager -l
   ```

4. **Docker Issues**
   ```bash
   # Rebuild containers
   docker-compose down
   docker-compose up --build -d
   ```

### Debug Mode

Enable debug logging:

```bash
# Set debug level
export LOG_LEVEL=debug
npm start
```

## 📈 Performance

### Resource Usage

- **Memory**: ~50MB average
- **CPU**: <5% on modern systems
- **Disk**: ~1KB per commit
- **Network**: Minimal (git push only)

### Optimization

- Efficient quote selection algorithm
- Minimal memory footprint
- Async/await for non-blocking operations
- Graceful error recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository**: https://github.com/izzyhack/4.5M-S
- **Issues**: https://github.com/izzyhack/4.5M-S/issues
- **Docker Hub**: (coming soon)

## 📞 Support

- Create an issue for bug reports
- Discussion forum for questions
- Wiki for detailed documentation

---

*"Technology is best when it brings people together." - Matt Mullenweg*
