FROM node:10.15.3-alpine

RUN mkdir /opt/app && chown node:node /opt/app

RUN apk add --update git && \
rm -rf /tmp/* /var/cache/apk/*

# Create app directory
WORKDIR /opt/app

USER node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY webpack*.js ./

# Babel 7 presets and plugins
COPY .babelrc ./

# Bundle app source
COPY src ./src

RUN npm install && npm run build

EXPOSE 3001

CMD ["node", "dist/server"]
