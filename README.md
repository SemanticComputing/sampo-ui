# Mapping Manuscript Migrations Web App

Project homepage: http://mappingmanuscriptmigrations.org/

master branch visible at http://dev.ui.mappingmanuscriptmigrations.org/

test branch visible at http://test.ui.mappingmanuscriptmigrations.org/

## Requirements

Node.js 8.x: https://nodejs.org/en/download/releases/

Nodemon https://nodemon.io/

## Local development

```
npm install
npm run dev
```

## Deploy with Docker

### Build
 `docker build -t mmm-web-app-c .`

### Run
 `docker run -d -p 3006:3001 --name mmm-web-app mmm-web-app-c`

### Upgrade
```
docker build -t mmm-web-app-c .
docker stop mmm-web-app
docker rm mmm-web-app
docker run -d -p 3006:3001 --name mmm-web-app mmm-web-app-c
```
