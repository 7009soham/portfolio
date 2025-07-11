# SSL Setup for sohamhatescoding.live 🔐

## ✅ Current Status
- Domain: `sohamhatescoding.live`
- Email: `sohamjtare2002@gmail.com`
- EC2 Instance: Running

## 🚀 Step-by-Step SSL Setup

### Step 1: Verify Domain Points to EC2
First, make sure your domain points to your EC2 instance:

```bash
# Check if domain resolves to your EC2 IP
nslookup sohamhatescoding.live
dig sohamhatescoding.live
```

If not pointing to your EC2, update DNS records:
- **A Record**: `sohamhatescoding.live` → `Your-EC2-Public-IP`
- **A Record**: `www.sohamhatescoding.live` → `Your-EC2-Public-IP`

### Step 2: SSH into EC2 and Run SSL Setup

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Download and run the SSL setup script
curl -O https://raw.githubusercontent.com/7009soham/portfolio/main/setup-ssl.sh
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
```

**OR** run commands manually:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Certbot and Nginx
sudo apt install certbot python3-certbot-nginx nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Get SSL certificate
sudo certbot --nginx -d sohamhatescoding.live -d www.sohamhatescoding.live

# Follow prompts:
# 1. Enter email: sohamjtare2002@gmail.com
# 2. Agree to terms: A
# 3. Share email: Y or N (your choice)
# 4. Redirect HTTP to HTTPS: 2 (recommended)
```

### Step 3: Update GitHub Deployment

Update your `.github/workflows/deploy.yml`:

```yaml
name: Deploy Static Website via Docker to EC2

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Copy Files to EC2
      uses: appleboy/scp-action@v0.1.4
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USER }}
        key: ${{ secrets.EC2_SSH_KEY }}
        source: "."
        target: "~/sohamsite"

    - name: SSH into EC2 and Rebuild Docker with SSL
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USER }}
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          cd ~/sohamsite
          
          # Stop existing containers
          docker-compose down
          
          # Backup SSL certificates (if they exist)
          if [ -d "/etc/letsencrypt" ]; then
            echo "SSL certificates found, proceeding with SSL setup..."
          else
            echo "No SSL certificates found, please run SSL setup first"
            exit 1
          fi
          
          # Rebuild and start with SSL support
          docker-compose build --no-cache
          docker-compose up -d
          
          # Test SSL
          echo "Testing SSL configuration..."
          curl -I https://sohamhatescoding.live
```

### Step 4: Test Your SSL

After setup, test your SSL:

1. **Browser Test**: Visit `https://sohamhatescoding.live`
2. **SSL Labs Test**: https://www.ssllabs.com/ssltest/analyze.html?d=sohamhatescoding.live
3. **Command Line Test**:
   ```bash
   curl -I https://sohamhatescoding.live
   openssl s_client -connect sohamhatescoding.live:443
   ```

### Step 5: Auto-Renewal Setup

Let's Encrypt certificates expire every 90 days. Auto-renewal is set up automatically:

```bash
# Check auto-renewal timer
sudo systemctl status certbot.timer

# Test renewal
sudo certbot renew --dry-run

# Manual renewal (if needed)
sudo certbot renew
```

## 🔧 Troubleshooting

### If SSL setup fails:

1. **Check domain DNS**:
   ```bash
   dig sohamhatescoding.live
   ```

2. **Check nginx status**:
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

3. **Check ports**:
   ```bash
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

4. **Check firewall**:
   ```bash
   sudo ufw status
   # If needed, allow ports:
   sudo ufw allow 80
   sudo ufw allow 443
   ```

### Common Issues:

- **Domain not pointing to EC2**: Update DNS A records
- **Port 80 blocked**: Check AWS Security Group (allow HTTP/HTTPS)
- **Nginx not running**: `sudo systemctl start nginx`
- **Certificate validation failed**: Wait for DNS propagation (up to 24 hours)

## 🎉 Success Indicators

✅ **Your site should show**:
- Green lock icon in browser
- `https://` in URL
- No "Not Secure" warnings
- SSL Labs rating A or higher

## 📞 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Review nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Check Let's Encrypt logs: `sudo tail -f /var/log/letsencrypt/letsencrypt.log`

## 🚀 Next Steps After SSL

1. **Update all internal links** to use HTTPS
2. **Set up HSTS headers** (already in nginx-ssl.conf)
3. **Enable HTTP/2** (already enabled in config)
4. **Test performance** with SSL enabled
5. **Monitor certificate expiration** (auto-renewal should handle this)
