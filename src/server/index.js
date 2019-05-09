import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { has } from 'lodash';
import { getPaginatedResults, getAllResults, getByURI } from './sparql/FacetResults';
import { getFacet } from './sparql/FacetValues';
import { queryJenaIndex } from './sparql/JenaQuery';
const DEFAULT_PORT = 3001;
const app = express();
app.set('port', process.env.PORT || DEFAULT_PORT);
app.use(bodyParser.json());

// allow CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// The root directory from which to serve static assets (React app)
const publicPath = path.join(__dirname, './../public/');
app.use(express.static(publicPath));

// React app makes requests to these api urls
const apiPath = '/api';

// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
app.get(`${apiPath}/:resultClass/paginated`, async (req, res, next) => {
  try {
    const data = await getPaginatedResults({
      resultClass: req.params.resultClass,
      page: parseInt(req.query.page) || null,
      pagesize: parseInt(req.query.pagesize) || null,
      uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
      spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters),
      textFilters: req.query.textFilters == null ? null : JSON.parse(req.query.textFilters),
      sortBy: req.query.sortBy || null,
      sortDirection: req.query.sortDirection || null
    });
    res.json(data);
  } catch(error) {
    next(error);
  }
});

app.get(`${apiPath}/:resultClass/all`, async (req, res, next) => {
  try {
    const data = await getAllResults({
      resultClass: req.params.resultClass,
      facetClass: req.query.facetClass || null,
      uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
      spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters),
      textFilters: req.query.textFilters == null ? null : JSON.parse(req.query.textFilters),
      variant: req.query.variant || null,
    });
    res.json({
      resultCount: data.count,
      results: data
    });
  } catch(error) {
    next(error);
  }
});

app.get(`${apiPath}/:resultClass/instance/:uri`, async (req, res, next) => {
  try {
    const data = await getByURI({
      resultClass: req.params.resultClass,
      facetClass: req.query.facetClass || null,
      uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
      spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters),
      textFilters: req.query.textFilters == null ? null : JSON.parse(req.query.textFilters),
      variant: req.query.variant || null,
      uri: req.params.uri
    });
    // there is always one object in the 'data' array
    res.json(data[0]);
  } catch(error) {
    next(error);
  }
});

app.get(`${apiPath}/:facetClass/facet/:id`, async (req, res, next) => {
  try {
    const data = await getFacet({
      facetClass: req.params.facetClass,
      facetID: req.params.id,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection,
      uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
      spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters),
      textFilters: req.query.textFilters == null ? null : JSON.parse(req.query.textFilters)
    });
    res.json(data);
  } catch(error) {
    next(error);
  }
});

app.get(`${apiPath}/search`, async (req, res, next) => {
  let queryTerm = '';
  let latMin = 0;
  let longMin = 0;
  let latMax = 0;
  let longMax = 0;
  if (has(req.query, 'q')) {
    queryTerm = req.query.q;
  }
  if (has(req.query, 'latMin')) {
    latMin = req.query.latMin;
    longMin = req.query.longMin;
    latMax = req.query.latMax;
    longMax = req.query.longMax;
  }
  try {
    const data = await queryJenaIndex({
      queryTerm: queryTerm,
      latMin: latMin,
      longMin: longMin,
      latMax: latMax,
      longMax: longMax,
    });
    res.json(data);
  } catch(error) {
    next(error);
  }
});

/*  Routes are matched to a url in order of their definition
    Redirect all the the rest for react-router to handle */
app.get('*', function(request, response) {
  response.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(app.get('port'), () =>
  console.log(`
  Express server listening on port ${app.get('port')}
  Static files (e.g. the React app) will be served from ${publicPath}
  API path is ${apiPath}
  `)
);
