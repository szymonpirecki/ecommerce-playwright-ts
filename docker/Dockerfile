FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

# Install Node dependencies before copying the full source so this layer is
# cached as long as the manifests don't change.
COPY package*.json ./
RUN npm ci

COPY . .

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Default to production so a plain `docker run` hits the live site.
# Override with -e TEST_ENV=staging or via docker-compose.
ENV TEST_ENV=production

ENTRYPOINT ["/entrypoint.sh"]
