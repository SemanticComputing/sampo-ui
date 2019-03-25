import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { getPaginatedResults, getAllResults, getByURI } from './sparql/FacetResults';
import { getFacet } from './sparql/FacetValues';
const DEFAULT_PORT = 3001;
const app = express();
const apiPath = '/api';

app.set('port', process.env.PORT || DEFAULT_PORT);
app.use(bodyParser.json());

// allow CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get(`${apiPath}/:resultClass/paginated`, (req, res, next) => {
  return getPaginatedResults({
    resultClass: req.params.resultClass,
    page: parseInt(req.query.page) || null,
    pagesize: parseInt(req.query.pagesize) || null,
    uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
    spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters),
    sortBy: req.query.sortBy || null,
    sortDirection: req.query.sortDirection || null
  }).then(data => {
    res.json(data);
  }).catch(next);
});

app.get(`${apiPath}/:resultClass/all`, (req, res, next) => {
  return getAllResults({
    resultClass: req.params.resultClass,
    facetClass: req.query.facetClass || null,
    uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
    spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters),
    variant: req.query.variant || null,
  }).then(data => {
    res.json({
      resultCount: data.count,
      results: data
    });
  }).catch(next);
});

app.get(`${apiPath}/:resultClass/instance/:uri`, (req, res, next) => {
  return getByURI({
    resultClass: req.params.resultClass,
    facetClass: req.query.facetClass || null,
    uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
    spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters),
    variant: req.query.variant || null,
    uri: req.params.uri
  })
    .then(data => {
      res.json(data[0]);
    }).catch(next);
});

app.get(`${apiPath}/:facetClass/facet/:id`, (req, res, next) => {
  return getFacet({
    facetClass: req.params.facetClass,
    facetID: req.params.id,
    sortBy: req.query.sortBy,
    sortDirection: req.query.sortDirection,
    uriFilters: req.query.uriFilters == null ? null : JSON.parse(req.query.uriFilters),
    spatialFilters: req.query.spatialFilters == null ? null : JSON.parse(req.query.spatialFilters)
  })
    .then(data => {
      res.json(data);
    }).catch(next);
});

/*  Routes are matched to a url in order of their definition
    Redirect all the the rest for react-router to handle */
app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, './../public/', 'index.html'))
    .catch(next);
});

app.listen(app.get('port'), () => console.log('MMM API listening on port ' + app.get('port')));
