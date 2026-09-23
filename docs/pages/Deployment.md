# Deploying a sampo app

The intended way to deploy a sampo application is to use the pre-built sampo core images. Here are some ways to deploy
using said images.

## Separate server and client containers
You can simply run both the client and server containers separately. The server image requires only the configs
mounted as a volume, while the client service requires only your custom components.

## Using combo image
In cases where your app has no need of splitting between client and server it is easier to simply run the entire
app as 1 container using the combo image. With this method everything is exposed on port 80 and the server runs on "/api".

## Baking config build
Another option using the combo image is to simply use it as a base image and directly bake your configs into it.

Example Dockerfile:
```
FROM node:22.17-slim AS base
WORKDIR /app

COPY custom_components .
RUN npm install --legacy-peer-deps

RUN npm run build

FROM ghcr.io/ghentcdh/sampo-ui-combo:v4.4.3 as prod
COPY --from=base /app/dist/ /app/custom-components
COPY sampoConfigs/ /app/configs/
ENV NODE_ENV=production
```