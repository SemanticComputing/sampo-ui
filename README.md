# Hipla.fi

## Build
 `docker build -t hipla-full-stack .`

## Run
 `docker run -d -p 3005:3001 --name hipla hipla-full-stack`

## Upgrade
```
docker build -t hipla-full-stack .
docker stop hipla
docker rm hipla
docker run -d -p 3005:3001 --name hipla hipla-full-stack
```
