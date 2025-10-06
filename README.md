[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
# Sampo-UI

This fork of Sampo-UI has as main purpose to modernise the framework to make it more usable for new projects.
Secondly, it also tries to move as much customisation as possible to configs to make it more robust and future-proof.

See the [wiki page](https://github.com/GhentCDH/sampo-ui/wiki/Sampo%E2%80%90UI-updates-by-GhentCDH) for detailed
explanations on changes made.

## Running development and production

### Development

Copy the content of `example.env` into your own `.env` file. Note that if you need additional env variables that you
need to add them to compose.yaml as well.

Then run:

```
docker compose up
```
to run both client and server in development mode.


### Production

To build client and server images run:
```bash
docker compose -f compose-prod.yaml build 
```

To run prod containers make sure you again have a .env with your `API_URL` and all other env variables you need. Again 
note that if you need additional env variables that you need to add them to compose-prod.yaml as well.
Then run:

```bash
docker compose -f compose-prod.yaml up
```

## Developer guide

### Coding style

The [JavaScript style guide, linter, and formatter](https://standardjs.com) module (named "standard" in package.json) is installed by default as development dependency. Do not install or create any additional style definitions or configurations. Instead, install an appropriate [plugin](https://standardjs.com/index.html#are-there-text-editor-plugins) for your text editor. If there are no plugins  available for your favorite editor, it is highly recommended to switch into a supported editor. 

## Documentation

### Client

Sampo-UI's React components are documented [here](https://semanticcomputing.github.io/sampo-ui) using Storybook.

Here is a list of the main JavaScript libraries on which the Sampo-UI client is built on:

* [React &ndash; A JavaScript library for building user interfaces](https://reactjs.org/)
* [Material-UI &ndash; React components for faster and easier web development](https://material-ui.com/)
* [Redux &ndash; A Predictable State Container for JS Apps](https://redux.js.org/)
* [redux-observable &ndash; RxJS-based middleware for Redux](https://redux-observable.js.org/)
* [Reselect &ndash; Selector library for Redux](https://github.com/reduxjs/reselect)
* [React Router &ndash; Declarative routing for React](https://reacttraining.com/react-router/web/guides/quick-start)
* [react-intl-universal &ndash; React internationalization package developed by Alibaba Group](https://github.com/alibaba/react-intl-universal)
* [deck.gl &ndash; Large-scale WebGL-powered Data Visualization](https://deck.gl) 
* [react-map-gl &ndash; React friendly API wrapper around MapboxGL JS](https://github.com/visgl/react-map-gl) 
* [Leaflet &ndash; a JavaScript library for interactive maps](https://leafletjs.com/) 
* [Cytoscape &ndash; an open source software platform for visualizing complex networks](https://cytoscape.org/)
* [ApexCharts.js &ndash; Open Source JavaScript Charts for your website](https://apexcharts.com/)
* [React Sortable Tree &ndash; A React component for representation of hierarchical data](https://github.com/frontend-collective/react-sortable-tree)
* [Moment.js &ndash; Parse, validate, manipulate, and display dates and times in JavaScript](https://momentjs.com/)

### Backend

The API provided by Sampo-UI's backend includes routes for the following search paradigms: faceted search, 
full text search, and federated full text or spatial search. The API is described using the 
[OpenAPI Specification](https://swagger.io/specification). The same specification is used for both 
documenting the API, and validating the API requests and responses. 

An API documentation with example configuration can been seen [here](https://sampo-ui.demo.seco.cs.aalto.fi/api-docs/).

Sampo-UI's backend is based on the following JavaScript libraries:

* [Express &ndash; Fast, unopinionated, minimalist web framework for Node.js](https://expressjs.com/)
* [axios &ndash; Promise based HTTP client for the browser and Node.js](https://github.com/axios/axios)
* [Lodash &ndash; A modern JavaScript utility library delivering modularity, performance & extras](https://lodash.com/)

## Extra: forking into the same organization account

In GitHub it's not possible to fork an organization's repository to that same organization. If a new repository needs to be created
using the *SemanticComputing* organization account, here is an alternative workflow for forking:

1. Clone this repository:
`git clone git@github.com:SemanticComputing/sampo-ui.git`

2. Set up a new GitHub repository. Do not initialize it with anything. It needs to be an empty repository.
You can name it how you like and you can rename your local folder to match that.

3. Copy the url of your new repository.

4. With terminal go to the folder with the clone of this repository (*sampo-ui*).

5. Change remote origin from *sampo-ui* to your new repository:
`git remote set-url origin [your new github repo here]`

6. Check that the origin changed to your new repository:
`git remote -v`

7. Push your local clone of *sampo-ui* to your new repository:
`git push`

8. Set *sampo-ui* as the upstream of your new repository:
`git remote add upstream git@github.com:SemanticComputing/sampo-ui.git`

9. When new commits appear on the *sampo-ui* repository you can fetch them to your new repository.
The example fetches only master branch:
`git fetch upstream master`

10. Go to the branch of your new repository where you want to merge the changes in upstream.
Merge, solve conflicts and enjoy:
`git merge upstream/master`
