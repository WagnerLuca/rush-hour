# Rush Hour Game - Docker Image
# Uses nginx to serve the static files

FROM nginx:alpine

# Add labels for better image management
LABEL maintainer="Rush Hour Game"
LABEL description="Rush Hour sliding block puzzle game"
LABEL version="1.0"

# Copy game files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY game.js /usr/share/nginx/html/
COPY levels.js /usr/share/nginx/html/

# Copy custom nginx configuration (optional, for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
