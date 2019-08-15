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

## Set up a new project using this repository as a base, with the possibility of merging the new commits added to this repository

1. Normally clone the project to your local computer:
`git clone git@github.com:SemanticComputing/mmm-web-app.git`

2. Set up a new github repo. Do not initialize it with anything. It needs to be an empty repo.
You can name it how you like and you can rename your local folder to match that.

3. Copy the url of your new repo.

4. With terminal go to the folder with the cloned mmm-repo on your local computer.

5. Change remote origin from mmm-web-app to your new repo:
`git remote set-url origin [your new github repo here]`

6. Check that the origin changed to your new github repo:
`git remote -v`

7. Push your local clone of mmm-web-app to your new github repo:
`git push`

8. Set the original github repo of mmm-web-app as the upstream of your new project:
`git remote add upstream git@github.com:SemanticComputing/mmm-web-app.git`

9. When new commits appear on the original mmm-web-app you can fetch them to your project.
The example fetches only master branch:
`git fetch upstream master`

10. Go to the branch of your project where you want to merge the changes in upstream.
Merge, solve conflicts and enjoy:
`git merge upstream/master`
