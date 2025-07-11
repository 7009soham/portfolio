FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy only the necessary web files
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY img/ /usr/share/nginx/html/img/

# Create directory for SSL certificates (if using Let's Encrypt)
RUN mkdir -p /etc/letsencrypt

# Expose ports 80 and 443
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
