# Prop Trading Simulator Deployment Guide

A guide for deploying the complete Prop Trading Simulator stack, including the React frontend and Rust backend.

## Overview

The deployment consists of two main components:
1. React frontend (this repository)
2. Rust backend service providing Monte Carlo simulations ([prop-simulator](https://github.com/razor389/prop-simulator))

## Directory Structure
```
/var/www/
└── prop-simulator-web/
    ├── dist/            # Frontend build output
    ├── logs/           # Application-specific logs
    │   ├── access.log
    │   └── error.log

/home/ubuntu/
└── prop-simulator/     # Backend service
    └── target/
        └── release/
            └── prop-simulator  # Compiled backend binary
```

## Prerequisites

- Ubuntu 20.04 or newer
- Node.js 18+ and npm 9+
- Rust toolchain
- Nginx
- Domain name with DNS configured
- SSL certificate (recommended: Let's Encrypt)

## System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y build-essential curl nginx

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# Verify installations
node --version  # Should be 18+
npm --version   # Should be 9+
rustc --version
cargo --version
nginx -v
```

## Backend Setup

1. **Clone and Build Backend**
```bash
# Clone repository
git clone https://github.com/razor389/prop-simulator.git
cd prop-simulator

# Build for production
cargo build --release --no-default-features --features "web"
```

2. **Create Systemd Service**
```bash
sudo nano /etc/systemd/system/prop-simulator.service
```

Add the following configuration:
```ini
[Unit]
Description=Prop Trading Simulator Backend
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
User=ubuntu  # Replace with your system user
Group=ubuntu  # Replace with your system group
WorkingDirectory=/home/ubuntu/prop-simulator  # Adjust path
ExecStart=/home/ubuntu/prop-simulator/target/release/prop-simulator
Restart=always
RestartSec=1
Environment=RUST_LOG=info

# Security settings
NoNewPrivileges=yes
ProtectSystem=full
ProtectHome=read-only
PrivateTmp=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectControlGroups=yes

[Install]
WantedBy=multi-user.target
```

3. **Enable and Start Backend Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable prop-simulator
sudo systemctl start prop-simulator
sudo systemctl status prop-simulator  # Verify it's running
```

## Frontend Setup

1. **Prepare Web Directory**
```bash
# Create web directory structure
sudo mkdir -p /var/www/prop-simulator-web/{dist,logs}

# Set proper ownership
sudo chown -R $USER:$USER /var/www/prop-simulator-web
sudo chmod -R 755 /var/www/prop-simulator-web

# Create log files
sudo touch /var/www/prop-simulator-web/logs/access.log
sudo touch /var/www/prop-simulator-web/logs/error.log
```

2. **Deploy Frontend**
```bash
# Clone repository
git clone https://github.com/vespatrades/prop-simulator-web.git
cd prop-simulator-web

# Install dependencies
npm install

# Build for production
npm run build

# Copy build files
sudo cp -r dist/* /var/www/prop-simulator-web/dist/
```

## Nginx Configuration

1. **Create Nginx Config**
```bash
sudo nano /etc/nginx/sites-available/prop-simulator-web
```

2. **Add Configuration**:
```nginx
server {
    server_name yourdomain.net;  # Replace with your domain

    # Enhanced logging
    access_log /var/www/prop-simulator-web/logs/access.log;
    error_log /var/www/prop-simulator-web/logs/error.log debug;

    # Serve static files from the Vite build output
    root /var/www/prop-simulator-web/dist;
    index index.html;

    # Main location block for SPA
    location / {
        try_files $uri $uri/ /index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy "strict-origin-when-cross-origin";
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: /api/placeholder/; connect-src 'self' https://yourdomain.net; frame-ancestors 'none'; form-action 'self';";
    }

    # Backend proxy
    location /simulate {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;

        # Timeouts for long-running simulations
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;

        # Buffer settings
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;

        # CSV upload size limit
        client_max_body_size 10M;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/yourdomain.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.net/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourdomain.net;
    return 301 https://$host$request_uri;
}
```

3. **Enable Configuration**
```bash
sudo ln -s /etc/nginx/sites-available/prop-simulator-web /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.net

# Verify auto-renewal
sudo systemctl status certbot.timer
```

## Log Rotation

Create log rotation configuration:
```bash
sudo nano /etc/logrotate.d/prop-simulator-web
```

Add:
```
/var/www/prop-simulator-web/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endscript
}
```

## Updates and Maintenance

### Frontend Updates
```bash
cd prop-simulator-web
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/prop-simulator-web/dist/
```

### Backend Updates
```bash
cd prop-simulator
git pull
cargo build --release --no-default-features --features "web"
sudo systemctl restart prop-simulator
```

## Security Checklist

1. **File Permissions**
```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/prop-simulator-web
sudo chmod -R 755 /var/www/prop-simulator-web
sudo chmod 640 /var/www/prop-simulator-web/logs/*
```

2. **Firewall Setup**
```bash
sudo ufw allow 22     # SSH
sudo ufw allow 80     # HTTP
sudo ufw allow 443    # HTTPS
sudo ufw enable
```

## Troubleshooting

1. **Backend Service Issues**:
```bash
# Check service status
sudo systemctl status prop-simulator

# View logs
sudo journalctl -u prop-simulator -n 100
```

2. **Frontend/Nginx Issues**:
```bash
# Test nginx config
sudo nginx -t

# Check error logs
sudo tail -f /var/www/prop-simulator-web/logs/error.log
```

## Additional Resources

- [Rust Backend Repository](https://github.com/razor389/prop-simulator)
- [Frontend Repository](https://github.com/vespatrades/prop-simulator-web)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Certbot Instructions](https://certbot.eff.org/instructions)