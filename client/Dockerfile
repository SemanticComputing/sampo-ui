# Base stage for client setup
FROM node:22.17-slim AS base
WORKDIR /app
# Install dependencies
COPY package*.json ./client/
RUN cd client && npm install

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

FROM nginx:stable AS client-prod
COPY --from=client-build /app/client/dist/public /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]