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


FROM node:22.20-slim AS combo-prd
# Make sure necessary directories exist
RUN mkdir -p /app/server /app/public
# Set working directory
WORKDIR /app/server
# Copy built client and server files
COPY --from=client-build /app/client/dist /app/
COPY --from=server-build /app/server /app/server

# Config should be replaced or mounted in your production environment
COPY ./configs /app/configs

# Expose server port and start the server
EXPOSE 3001
CMD ["node", "dist/index.js"]
