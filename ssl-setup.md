# SSL Certificate Setup for Portfolio Website

## Option 1: Let's Encrypt SSL (Recommended - FREE)

### Prerequisites:
- Domain name pointing to your EC2 instance
- SSH access to your EC2 instance
- Nginx running on port 80

### Step 1: SSH into your EC2 instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 2: Install Certbot
```bash
# Update system
sudo apt update

# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

### Step 3: Get SSL Certificate
```bash
# Replace yourdomain.com with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 4: Auto-renewal setup
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Check if auto-renewal cron job exists
sudo systemctl status certbot.timer
```

### Step 5: Update Nginx Configuration
Certbot will automatically update your nginx config, but here's what it should look like:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

## Option 2: CloudFlare SSL (Easy Alternative)

### Step 1: Sign up for CloudFlare
1. Go to cloudflare.com
2. Add your domain
3. Change nameservers to CloudFlare's

### Step 2: Enable SSL
1. Go to SSL/TLS tab
2. Set encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"

### Step 3: Update DNS
Point your domain to your EC2 IP through CloudFlare

## Option 3: AWS Certificate Manager (If using Load Balancer)

### Step 1: Request Certificate
```bash
aws acm request-certificate \
    --domain-name yourdomain.com \
    --subject-alternative-names www.yourdomain.com \
    --validation-method DNS
```

### Step 2: Validate Domain
Add the DNS validation records to your domain

### Step 3: Attach to Load Balancer
Attach the certificate to your Application Load Balancer

## Update Docker Setup for SSL

### Updated docker-compose.yml
```yaml
services:
  website:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    container_name: soham-nginx-site
    restart: always
```

### Create nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name _;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Security Headers (Bonus)

Add these to your nginx config for extra security:

```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Verification Commands

### Check SSL Certificate
```bash
# Check certificate details
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect yourdomain.com:443
```

### Online SSL Checkers
- https://www.ssllabs.com/ssltest/
- https://www.digicert.com/help/
