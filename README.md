# Sampo-UI

A framework for building user interfaces for semantic portals. The following portals use this repository as a base:

* [NameSampo](https://github.com/SemanticComputing/nimisampo.fi)
* [Mapping Manuscript Migrations](https://github.com/mapping-manuscript-migrations/mmm-web-app)
* [WarVictimSampo 1914&ndash;1922](https://github.com/SemanticComputing/sotasurmat-web-app)
* [LawSampo](https://github.com/SemanticComputing/lawsampo-web-app)
* [AcademySampo](https://github.com/SemanticComputing/academysampo-web-app)
* [FindSampo](https://github.com/SemanticComputing/findsampo-web-app) 
* [HistorySampo](https://github.com/SemanticComputing/historysampo-web-app) 
* ParliamentSampo (TBA)

The Sampo-UI framework is being developed by the [Semantic Computing Research Group (SeCo)](https://seco.cs.aalto.fi) 
at the Aalto University, Finland. See the [research page](https://seco.cs.aalto.fi/tools/sampo-ui) for 
more information. 

## Design philosophy

Sampo-UI offers a comprehensive "starting base" of a full stack JavaScript web application. 
Therefore it is not possible to include Sampo-UI as separate component into an existing 
application. The 
most convienient way to build a new user interface using Sampo-UI is to read the documentation 
provided below, fork this repository, and start developing from there.

## Requirements

* [Node.js® &ndash; a JavaScript runtime built on Chrome's V8 JavaScript engine.](https://nodejs.org/en/) (tested with 10.15.3 LTS)

* [Nodemon &ndash; monitor for any changes in your source and automatically restart your server](https://nodemon.io/)

Note for Linux users: if your home directory is mounted from a network drive, using the [Node Version Manager](https://github.com/nvm-sh/nvm) for installing Node.js highly recommended. 

## Installation

### Local development

Install the dependencies specified in `package.json` (this command needs to be run only once,
  as long as you don't modify the dependencies):

`npm install`

Run client and server concurrently:

`npm run dev`

### Deploy with Docker

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

## Developer guide

The Sampo-UI framework consists of a client and a backend. This repository includes an example 
config of a semantic portal with four perspectives with two different 
SPARQL endpoints. In order to connect to new SPARQL endpoints, the client and the 
backend need to be modified accordingly. 

### Folder structure

It is recommended that you create the files that are specific to your portal in subfolders, 
to separate them from the general files of Sampo-UI. You can just copy the five folders named *sampo* and rename them with the name of your portal to get a starting base for your files.


``` 
src
 ┣ client
 ┃ ┣ components
 ┃ ┃ ┣ perspectives
 ┃ ┃ ┃ ┗ YOUR_PORTAL
 ┃ ┃ ┃ ┃ ┣ FacetedSearchPerspective.js   <-- combine your perspective components here
 ┃ ┃ ┃ ┃ ┣ Perspective1.js
 ┃ ┃ ┃ ┃ ┣ ...
 ┃ ┣ configs
 ┃ ┃ ┗ YOUR_PORTAL
 ┃ ┃ ┃ ┣ GeneralConfig.js 
 ┃ ┃ ┃ ┣ PerspectiveConfig.js 
 ┃ ┃ ┃ ┗ PerspectiveConfigOnlyInfoPages.js
 ┃ ┣ reducers
 ┃ ┃ ┗ YOUR_PORTAL   <-- add reducers for all your perspectives
 ┃ ┃ ┃ ┣ fullTextSearch.js
 ┃ ┃ ┃ ┣ perspective1.js
 ┃ ┃ ┃ ┣ perspective1Facets.js
 ┃ ┃ ┃ ┣ ...
 ┃ ┃ ┣ index.js   <-- combine your reducers here
 ┃ ┣ translations
 ┃ ┃ ┗ YOUR_PORTAL
 ┃ ┃ ┃ ┣ localeEN.js
 ┃ ┃ ┃ ┣ ...
 ┗ server
 ┃ ┣ sparql
 ┃ ┃ ┣ YOUR_PORTAL
 ┃ ┃ ┃ ┣ perspective_configs
 ┃ ┃ ┃ ┃ ┗ ... <-- endpoint and facet configs for each perspective 
 ┃ ┃ ┃ ┣ sparql_queries
 ┃ ┃ ┃ ┃ ┗ ...  <-- SPARQL queries
 ┃ ┃ ┃ ┗ BackendSearchConfig.js <-- combine your backend config into this file  
 ┃ ┗ index.js <-- import the backend config file here
```

## Documentation

### Client

Sampo-UI's React components are documented [here](https://semanticcomputing.github.io/sampo-ui).

Sampo-UI's client is based on the following JavaScript libraries:

* [React &ndash; A JavaScript library for building user interfaces](https://reactjs.org/)
* [Material-UI &ndash; React components for faster and easier web development.](https://material-ui.com/)
* [Redux &ndash; A Predictable State Container for JS Apps](https://redux.js.org/)
* [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
* [deck.gl &ndash; Large-scale WebGL-powered Data Visualization](https://deck.gl) 
* [Leaflet &ndash; a JavaScript library for interactive maps](https://leafletjs.com/) 
* [Cytoscape &ndash; an open source software platform for visualizing complex networks](https://cytoscape.org/)
* [ApexCharts.js &ndash; Open Source JavaScript Charts for your website](https://apexcharts.com/)

### Backend

The API provided by Sampo-UI's backend includes routes for the following search paradigms: faceted search, 
full text search, and federated full text or spatial search. The API is described using the 
[OpenAPI Specification](https://swagger.io/specification). The same specification is used for both 
documenting the API, and validating the API requests and responses. 

An API documentation with example configuration can been seen [here](https://sampo-ui.demo.seco.cs.aalto.fi/api-docs/).

Sampo-UI's backend is based on the following JavaScript libraries:

* [Express &ndash; Fast, unopinionated, minimalist web framework for Node.js](https://expressjs.com/)
* [axios &ndash; Promise based HTTP client for the browser and Node.js](https://expressjs.com/)
* [Lodash &ndash; A modern JavaScript utility library delivering modularity, performance & extras](https://lodash.com/)

## Extra: forking into the same organization account

In GitHub it's not possible to fork an organization's repository to that same organization. If a new repository needs to be created
using the *SemanticComputing* organization account, here is an alternative workflow for forking:

1. Clone this repository:
`git clone git@github.com:SemanticComputing/sampo-ui.git`

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
`git remote add upstream git@github.com:SemanticComputing/sampo-ui.git`

9. When new commits appear on the original repository (sampo-web-app) you can fetch them to your new repository.
The example fetches only master branch:
`git fetch upstream master`

10. Go to the branch of your new repository where you want to merge the changes in upstream.
Merge, solve conflicts and enjoy:
`git merge upstream/master`
