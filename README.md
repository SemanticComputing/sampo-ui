# SampoSampo

A software framework and toolset for implementing semantic portals. The following portals use this repository as a base:

* [Mapping Manuscript Migrations](https://github.com/mapping-manuscript-migrations/mmm-web-app)
* [WarVictimSampo 1914-1922](https://github.com/SemanticComputing/sotasurmat-web-app)
* [LawSampo](https://github.com/SemanticComputing/lawsampo-web-app)
* [AcademySampo](https://github.com/SemanticComputing/academysampo-web-app)
* [FindSampo](https://github.com/SemanticComputing/findsampo-web-app) 
* [ParliamentSampo?]

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
 `docker build -t sampo-web-app-image .`

### Run
 `docker run -d -p 3006:3001 --name sampo-web-app sampo-web-app-image`

 ### Run with password protected endpoint
 `docker run -d -p 3006:3001 -e SPARQL_ENDPOINT_BASIC_AUTH=your_password --name sampo-web-app sampo-web-app-image`

### Upgrade
```
docker build -t sampo-web-app-image .
docker stop sampo-web-app
docker rm sampo-web-app
docker run -d -p 3006:3001 --name sampo-web-app sampo-web-app-image
```

## Set up a new project using this repository as a base, with the possibility of merging the new commits added to this repository

1. Clone this repository:
`git clone git@github.com:SemanticComputing/sampo-web-app.git`

2. Set up a new GitHub repository. Do not initialize it with anything. It needs to be an empty repository.
You can name it how you like and you can rename your local folder to match that.

3. Copy the url of your new repository.

4. With terminal go to the folder with the clone of this repository (sampo-web-app).

5. Change remote origin from sampo-web-app to your new repository:
`git remote set-url origin [your new github repo here]`

6. Check that the origin changed to your new repository:
`git remote -v`

7. Push your local clone of sampo-web-app to your new repository:
`git push`

8. Set the original repository (sampo-web-app) as the upstream of your new repository:
`git remote add upstream git@github.com:SemanticComputing/sampo-web-app.git`

9. When new commits appear on the original repository (sampo-web-app) you can fetch them to your new repository.
The example fetches only master branch:
`git fetch upstream master`

10. Go to the branch of your new repository where you want to merge the changes in upstream.
Merge, solve conflicts and enjoy:
`git merge upstream/master`
