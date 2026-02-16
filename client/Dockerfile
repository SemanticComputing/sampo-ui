# Base stage for client setup
FROM node:22.17-slim AS base

RUN mkdir -p /app/client
WORKDIR /app
# Install dependencies
COPY package*.json .
RUN npm install

# Client development stage
FROM base AS client-dev
COPY . ./client
WORKDIR /app/client
EXPOSE 8080
CMD ["npm", "run", "dev"]

# Client production build stage
FROM base AS client-build
COPY . ./client
WORKDIR /app/client
RUN npm run build

FROM nginx:alpine AS client-prod

COPY --from=client-build /app/client/dist/public /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

CMD ["/bin/sh", "-c", "SAMPO_UI_CLIENT_PORT=${SAMPO_UI_CLIENT_PORT:-80} envsubst '$SAMPO_UI_CLIENT_PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
