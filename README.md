# Mapping Manuscript Migrations Web App

Project homepage: http://mappingmanuscriptmigrations.org/

master branch visible at http://dev.ui.mappingmanuscriptmigrations.org/

test branch visible at http://test.ui.mappingmanuscriptmigrations.org/

## Requirements

Node.js https://nodejs.org/en/ (tested with 10.15.3 LTS)

Nodemon https://nodemon.io/

If your home directory is mounted from a network drive, Node.js should
be installed using Node Version Manager https://github.com/nvm-sh/nvm  

## Local development

Install the dependencies specified in `package.json` (this command needs to be run only once,
  as long as you don't modify the dependencies):

`npm install`

Run client and server concurrently:

`npm run dev`

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
