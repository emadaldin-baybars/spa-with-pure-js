# Use specific nginx version for reproducibility
FROM nginx:1.25-alpine

# Add metadata labels
LABEL maintainer="SPA Developer"
LABEL description="Production-ready SPA with Pure JavaScript"
LABEL version="1.0.0"

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy application files
COPY ./src /usr/share/nginx/html

# Set permissions for nginx to run
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Expose port
EXPOSE 80

# Start nginx (run as root since alpine nginx handles user directive internally)
CMD ["nginx", "-g", "daemon off;"]