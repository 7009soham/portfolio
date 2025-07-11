#!/bin/bash

# SSL Setup Script for sohamhatescoding.live
# Run this script on your EC2 instance

echo "🚀 Setting up SSL for sohamhatescoding.live"

# Step 1: Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Step 2: Install Certbot and Nginx plugin
echo "🔧 Installing Certbot..."
sudo apt install certbot python3-certbot-nginx nginx -y

# Step 3: Check if nginx is running
echo "✅ Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Step 4: Create basic nginx config for domain verification
echo "📝 Creating initial nginx configuration..."
sudo tee /etc/nginx/sites-available/sohamhatescoding.live > /dev/null <<EOF
server {
    listen 80;
    server_name sohamhatescoding.live www.sohamhatescoding.live;
    
    root /var/www/html;
    index index.html index.htm;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # Let's Encrypt verification
    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }
}
EOF

# Step 5: Enable the site
echo "🔗 Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/sohamhatescoding.live /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Step 6: Get SSL certificate
echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
sudo certbot --nginx -d sohamhatescoding.live -d www.sohamhatescoding.live --non-interactive --agree-tos --email sohamjtare2002@gmail.com

# Step 7: Test auto-renewal
echo "🔄 Testing certificate auto-renewal..."
sudo certbot renew --dry-run

# Step 8: Check SSL status
echo "✅ SSL Certificate installed successfully!"
echo "🌐 Your website is now available at:"
echo "   https://sohamhatescoding.live"
echo "   https://www.sohamhatescoding.live"

# Step 9: Display certificate info
echo "📜 Certificate information:"
sudo certbot certificates

echo ""
echo "🎉 SSL setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your Docker setup to use SSL"
echo "2. Deploy your portfolio website"
echo "3. Test SSL rating at: https://www.ssllabs.com/ssltest/analyze.html?d=sohamhatescoding.live"
