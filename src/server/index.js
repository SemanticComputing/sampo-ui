import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { getPaginatedResults, getAllResults, getPlace } from './sparql/FacetResults';
import { getFacet } from './sparql/Facets';
const DEFAULT_PORT = 3001;
const app = express();
const apiPath = '/api';

const serviceNA = 'MMM Unified Triple Store not available';

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

app.get(`${apiPath}/:resultClass/paginated`, (req, res) => {
  const page = parseInt(req.query.page) || null;
  const pagesize = parseInt(req.query.pagesize) || null;
  const sortBy = req.query.sortBy || null;
  const sortDirection = req.query.sortDirection || null;
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  return getPaginatedResults(req.params.resultClass, page, pagesize, filters, sortBy, sortDirection).then(data => {
    res.json(data);
  })
    .catch(err => {
      console.log(err);
      res.type('text');
      return res.status(500).send(serviceNA);
    });
});

app.get(`${apiPath}/:resultClass/all`, (req, res) => {
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  const variant = req.query.variant || null;
  return getAllResults(req.params.resultClass, req.query.facetClass, variant, filters).then(data => {
    res.json(data);
  })
    .catch(err => {
      console.log(err);
      res.type('text');
      return res.status(500).send(serviceNA);
    });
});

app.get(`${apiPath}/:resultClass/instance/:uri`, (req, res) => {
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  let getByURI = null;
  switch (req.params.resultClass) {
    // case 'manuscripts':
    //   getByURI = getManuscript;
    //   break;
    case 'places':
      getByURI = getPlace;
      break;
  }
  return getByURI(filters, req.params.uri).then(data => {
    res.json(data[0])
  })
    .catch(err => {
      res.type('text');
      return res.status(500).send(serviceNA);
    });
});

app.get(`${apiPath}/:resultClass/facet/:id`, (req, res) => {
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  return getFacet(req.params.resultClass, req.params.id, req.query.sortBy, req.query.sortDirection, filters).then(data => {
    res.json(data);
  })
    .catch((err) => {
      res.type('text');
      return res.status(500).send(serviceNA);
    });
});

/*  Routes are matched to a url in order of their definition
    Redirect all the the rest for react-router to handle */
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './../public/', 'index.html'));
});

app.listen(app.get('port'), () => console.log('MMM API listening on port ' + app.get('port')));
