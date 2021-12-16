FROM node:16.13.0-alpine
ARG API_URL
ARG MAPBOX_ACCESS_TOKEN

# Based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY webpack*.js ./

# Babel 7 presets and plugins
COPY babel.config.js ./

# Bundle app source
COPY src ./src

# Run the scripts defined in package.json using build arguments
RUN npm install && \ 
API_URL=$API_URL MAPBOX_ACCESS_TOKEN=$MAPBOX_ACCESS_TOKEN npm run build

EXPOSE 3001

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
USER node

# Express server handles the backend functionality and also serves the React app
CMD ["node", "/usr/src/app/dist/server"]
