FROM node:10.4-alpine

RUN mkdir /opt/hipla-full-stack && chown node:node /opt/hipla-full-stack

RUN apk add --update git && \
rm -rf /tmp/* /var/cache/apk/*

# Create app directory
WORKDIR /opt/hipla-full-stack

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
