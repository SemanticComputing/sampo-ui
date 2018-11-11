import express from 'express';
const path = require('path');
import bodyParser from 'body-parser';
import request from 'superagent';
import {
  getManuscripts,
  getManuscriptCount,
  getPlaces,
  getPlace,
  getFacet
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

// const filterObj = {
//   creationPlace: {
//     predicate: '^<http://erlangen-crm.org/efrbroo/R18_created>/<http://www.cidoc-crm.org/cidoc-crm/P7_took_place_at>',
//     values: ['<http://ldf.fi/mmm/place/7>', '<http://ldf.fi/mmm/place/5>']
//   },
//   author: {
//     predicate: '^<http://erlangen-crm.org/efrbroo/R18_created>/<http://www.cidoc-crm.org/cidoc-crm/P14_carried_out_by>',
//     values: ['<http://ldf.fi/mmm/person/84>', '<http://ldf.fi/mmm/person/894>']
//   }
// };
const filterObj = {};

app.get('/manuscripts', (req, res) => {
  const page = req.query.page || 1;

  return getManuscripts(page, filterObj).then((data) => {
    // console.log(data);
    res.json(data);
  })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get('/manuscript-count', (req, res) => {
  return getManuscriptCount(filterObj).then((data) => {
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

app.get('/facet', (req, res) => {
  const property = req.query.property;
  return getFacet(property).then((data) => {
    const facetValues = {
      creationPlace: data,
      author: []
    };
    //console.log(data);
    res.json(facetValues);
  })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get('/wfs', (req, res) => {

  return getWFSLayers(req.query.layerID).then((data) => {
    //console.log(data);
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

const getWFSLayers = (layerIDs) => {
  return Promise.all(layerIDs.map((layerID) => getWFSLayer(layerID)));
};

const getWFSLayer = (layerID) => {
  return new Promise((resolve, reject) => {
    // https://avaa.tdata.fi/web/kotus/rajapinta
    const url = 'http://avaa.tdata.fi/geoserver/kotus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + layerID + '&srsName=EPSG:4326&outputformat=json';
    request
      .get(url)
      .then(function(data) {
        return resolve({ layerID: layerID, geoJSON: data.body });
      })
      .catch(function(err) {
        return reject(err.message, err.response);
      });
  });
};



app.listen(app.get('port'), () => console.log('MMM API listening on port ' + app.get('port')));
