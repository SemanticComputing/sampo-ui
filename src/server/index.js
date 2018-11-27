import express from 'express';
const path = require('path');
import bodyParser from 'body-parser';
import {
  getManuscripts,
  getPlaces,
  getPlace,
  getFacets
} from './sparql/Manuscripts';
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

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, './../public/')));

app.get('/manuscripts', (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  const pagesize = 5;
  //console.log(filters)
  return getManuscripts(page, pagesize, filters).then(data => {
    // console.log(data);
    res.json(data);
  })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get('/places/:placeId?', (req, res) => {
  if (req.params.placeId) {
    return getPlace(req.params.placeId).then(data => {
      // console.log(data)
      res.json(data[0]);
    })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(500);
      });
  } else {
    const variant = req.query.variant ? req.query.variant : 'creationPlaces';
    return getPlaces(variant).then((data) => {
      // console.log(data);
      res.json(data);
    })
      .catch((err) => {
        console.log(err);
        return res.sendStatus(500);
      });
  }
});

app.get('/facets', (req, res) => {
  const filters = req.query.filters == null ? null : JSON.parse(req.query.filters);
  // console.log(filters)
  return getFacets(filters).then((data) => {
    res.json(data);
  })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

/*  Routes are matched to a url in order of their definition
    Redirect all the the rest for react-router to handle */
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './../public/', 'index.html'));
});

app.listen(app.get('port'), () => console.log('MMM API listening on port ' + app.get('port')));
