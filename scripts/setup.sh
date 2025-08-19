#!/bin/bash

# 4.5M-S Quote Committer System Installation Script
# Supports Ubuntu/Debian, CentOS/RHEL, and macOS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INSTALL_DIR="/opt/4.5m-s"
SERVICE_NAME="quotes"
USER="nodejs"
GROUP="nodejs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_info "Running as root user"
        return 0
    else
        log_error "This script must be run as root"
        echo "Please run: sudo $0"
        exit 1
    fi
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="ubuntu"
            log_info "Detected Ubuntu/Debian system"
        elif [ -f /etc/redhat-release ]; then
            OS="centos"
            log_info "Detected CentOS/RHEL system"
        else
            OS="linux"
            log_info "Detected generic Linux system"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        log_info "Detected macOS system"
    else
        log_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Install Node.js
install_nodejs() {
    log_info "Installing Node.js..."
    
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        log_info "Node.js already installed: $NODE_VERSION"
        return 0
    fi
    
    case $OS in
        ubuntu)
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            apt-get install -y nodejs
            ;;
        centos)
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            yum install -y nodejs
            ;;
        macos)
            if command -v brew >/dev/null 2>&1; then
                brew install node
            else
                log_error "Homebrew not found. Please install Node.js manually."
                exit 1
            fi
            ;;
    esac
    
    log_success "Node.js installed successfully"
}

# Install Git
install_git() {
    log_info "Installing Git..."
    
    if command -v git >/dev/null 2>&1; then
        GIT_VERSION=$(git --version)
        log_info "Git already installed: $GIT_VERSION"
        return 0
    fi
    
    case $OS in
        ubuntu)
            apt-get update
            apt-get install -y git
            ;;
        centos)
            yum install -y git
            ;;
        macos)
            if command -v brew >/dev/null 2>&1; then
                brew install git
            else
                log_info "Git should be available via Xcode Command Line Tools"
            fi
            ;;
    esac
    
    log_success "Git installed successfully"
}

# Create system user
create_user() {
    if [[ "$OS" == "macos" ]]; then
        log_info "Skipping user creation on macOS"
        return 0
    fi
    
    log_info "Creating system user: $USER"
    
    if id "$USER" &>/dev/null; then
        log_info "User $USER already exists"
        return 0
    fi
    
    case $OS in
        ubuntu)
            addgroup --system $GROUP
            adduser --system --group --home /var/lib/$USER $USER
            ;;
        centos)
            groupadd --system $GROUP
            useradd --system --gid $GROUP --home /var/lib/$USER $USER
            ;;
    esac
    
    log_success "User $USER created successfully"
}

# Install application
install_application() {
    log_info "Installing 4.5M-S Quote Committer System..."
    
    # Create installation directory
    mkdir -p $INSTALL_DIR
    
    # Copy application files
    cp -r "$APP_DIR/"* $INSTALL_DIR/
    
    # Set permissions
    if [[ "$OS" != "macos" ]]; then
        chown -R $USER:$GROUP $INSTALL_DIR
    fi
    chmod +x $INSTALL_DIR/scripts/*.sh
    
    # Create logs directory
    mkdir -p $INSTALL_DIR/logs
    if [[ "$OS" != "macos" ]]; then
        chown -R $USER:$GROUP $INSTALL_DIR/logs
    fi
    
    # Install npm dependencies
    cd $INSTALL_DIR
    sudo -u $USER npm install --production
    
    log_success "Application installed to $INSTALL_DIR"
}

# Install systemd service (Linux only)
install_service() {
    if [[ "$OS" == "macos" ]]; then
        log_info "Skipping systemd service installation on macOS"
        log_info "To run the service, use: launchctl load ~/Library/LaunchAgents/com.4.5m-s.quotes.plist"
        return 0
    fi
    
    log_info "Installing systemd service..."
    
    # Copy service file
    cp $INSTALL_DIR/config/quotes.service /etc/systemd/system/
    
    # Update service file with correct paths
    sed -i "s|/opt/4.5m-s|$INSTALL_DIR|g" /etc/systemd/system/quotes.service
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable service
    systemctl enable quotes.service
    
    log_success "Systemd service installed and enabled"
}

# Configure environment
setup_environment() {
    log_info "Setting up environment configuration..."
    
    if [ ! -f "$INSTALL_DIR/.env" ]; then
        cp "$INSTALL_DIR/.env.example" "$INSTALL_DIR/.env"
        log_info "Created .env file from example"
        log_warning "Please edit $INSTALL_DIR/.env to configure your settings"
    else
        log_info "Environment file already exists"
    fi
    
    # Set permissions
    if [[ "$OS" != "macos" ]]; then
        chown $USER:$GROUP "$INSTALL_DIR/.env"
        chmod 600 "$INSTALL_DIR/.env"
    fi
}

# Post-installation instructions
show_instructions() {
    log_success "Installation completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Configure your settings in: $INSTALL_DIR/.env"
    echo "2. Set up git credentials if needed"
    
    if [[ "$OS" != "macos" ]]; then
        echo "3. Start the service: sudo systemctl start quotes.service"
        echo "4. Check service status: sudo systemctl status quotes.service"
        echo "5. View logs: sudo journalctl -u quotes.service -f"
    else
        echo "3. Start the application: cd $INSTALL_DIR && node src/index.js"
    fi
    
    echo
    echo "For Docker deployment:"
    echo "1. cd $INSTALL_DIR"
    echo "2. docker-compose up -d"
    echo
    echo "Health check: $INSTALL_DIR/scripts/healthcheck.sh"
}

# Main installation process
main() {
    echo "=== 4.5M-S Quote Committer System Installation ==="
    echo
    
    check_root
    detect_os
    
    log_info "Starting installation process..."
    
    install_git
    install_nodejs
    create_user
    install_application
    install_service
    setup_environment
    
    show_instructions
}

# Handle command line options
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --help, -h    Show this help message"
        echo "  --uninstall   Uninstall the application"
        exit 0
        ;;
    --uninstall)
        log_info "Uninstalling 4.5M-S Quote Committer System..."
        
        # Stop service
        if [[ "$OS" != "macos" ]] && systemctl is-active --quiet quotes.service; then
            systemctl stop quotes.service
            systemctl disable quotes.service
            rm -f /etc/systemd/system/quotes.service
            systemctl daemon-reload
        fi
        
        # Remove installation directory
        rm -rf $INSTALL_DIR
        
        log_success "Application uninstalled successfully"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac