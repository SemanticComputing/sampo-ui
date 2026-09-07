# Combined Dockerfile for both client and server production builds

# Base stage for shared setup
# Client build stage
FROM node:22.20-slim AS client-build
RUN mkdir -p /app/client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./

ENV API_URL=/api/v1

RUN npm run build


# Server production build stage
FROM node:22.20-slim AS server-build
RUN mkdir -p /app/server
WORKDIR /app/server
COPY server/package*.json .
RUN npm install
COPY server/ ./
RUN npm run build


# ---------------------------------------------------------------------------
# combo-prd: single container — nginx (port 80) + Express (port 3001)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS combo-prd

# nginx: Alpine apk (uses /etc/nginx/http.d/ for server blocks)
# gettext: provides envsubst for nginx config templating
# wget: busybox wget is already present on alpine
RUN apk add --no-cache nginx gettext \
    && rm -f /etc/nginx/http.d/default.conf \
    && mkdir -p /etc/nginx/http.d /etc/nginx/templates

# OpenShift: allow nginx to run as non-root user and still write to its own dirs
RUN chgrp -R 0 /etc/nginx \
    && chmod -R g=u /etc/nginx \
    && chgrp -R 0 /var/lib/nginx \
    && chmod -R g=u /var/lib/nginx \
    && chgrp -R 0 /var/log/nginx \
    && chmod -R g=u /var/log/nginx \
    && chgrp -R 0 /run/nginx \
    && chmod -R g=u /run/nginx

# Client static files → nginx webroot (same path as standalone client-prod stage)
COPY --from=client-build /app/client/dist/public /usr/share/nginx/html

# nginx config template (combo version adds /api/ proxy to Express)
COPY combo-nginx.conf /etc/nginx/templates/default.conf.template

# Express server (compiled JS + node_modules)
COPY --from=server-build /app/server /app/server

# Default configs (override with -v ./configs:/app/configs at runtime)
COPY ./configs /app/configs

# Custom components dir (bind-mount a volume here at runtime if needed)
RUN mkdir -p /app/custom-components

# Combo startup entrypoint
COPY combo-entrypoint.sh /combo-entrypoint.sh
RUN chmod +x /combo-entrypoint.sh



# 80:   nginx serving the React SPA
# 3001: Express API (direct access, also proxied through nginx at /api/)
EXPOSE 80 3001

# Tests through nginx (/health is proxied to Express), so a crash in either
# service causes the container to report unhealthy.
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q --spider http://localhost:3001/health || exit 1

USER 8009

ENTRYPOINT ["/combo-entrypoint.sh"]
