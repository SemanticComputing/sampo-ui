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

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, './../public/')));

app.get(`${apiPath}/:resultClass/paginated`, (req, res, next) => {
  return getPaginatedResults({
    resultClass: req.params.resultClass,
    page: parseInt(req.query.page) || null,
    pagesize: parseInt(req.query.pagesize) || null,
    filters: req.query.filters == null ? null : JSON.parse(req.query.filters),
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
    filters: req.query.filters == null ? null : JSON.parse(req.query.filters),
    variant: req.query.variant || null,
  }).then(data => {
    res.json({
      resultCount: data.count,
      results: data
    });
  }).catch(next);
});

app.get(`${apiPath}/:resultClass/instance/:uri`, (req, res, next) => {
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  const variant = req.query.variant || null;
  const facetClass = req.query.facetClass || null;
  return getByURI(req.params.resultClass, facetClass, variant, filters, req.params.uri).then(data => {
    res.json(data[0]);
  }).catch(next);
});

app.get(`${apiPath}/:facetClass/facet/:id`, (req, res, next) => {
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  return getFacet(req.params.facetClass, req.params.id, req.query.sortBy, req.query.sortDirection, filters).then(data => {
    res.json(data);
  }).catch(next);
});

/*  Routes are matched to a url in order of their definition
    Redirect all the the rest for react-router to handle */
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './../public/', 'index.html'));
});

app.listen(app.get('port'), () => console.log('MMM API listening on port ' + app.get('port')));
