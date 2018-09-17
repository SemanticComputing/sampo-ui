import express from 'express';
import bodyParser from 'body-parser';
import request from 'superagent';
import _ from 'lodash';
import sparqlSearchEngine from './sparql/SparqlSearchEngine';
const DEFAULT_PORT = 3001;
const app = express();
//const isDevelopment  = app.get('env') !== 'production';

app.set('port', process.env.PORT || DEFAULT_PORT);
app.use(bodyParser.json());

// allow CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static(__dirname + './../public/'));

app.get('/suggest', (req, res) => {
  // https://softwareengineering.stackexchange.com/questions/233164/how-do-searches-fit-into-a-restful-interface
  // example request: http://localhost:3000/search?dataset=warsa_karelian_places&dataset=pnr&q=viip
  const queryDatasets = _.castArray(req.query.dataset);
  const queryTerm = req.query.q;
  // console.log(queryDatasets);

  return sparqlSearchEngine.getFederatedSuggestions(queryTerm, queryDatasets).then((data) => {
    // console.log(data);
    res.json(data);
  })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get('/search', (req, res) => {
  // https://softwareengineering.stackexchange.com/questions/233164/how-do-searches-fit-into-a-restful-interface
  // example request: http://localhost:3000/search?dataset=warsa_karelian_places&dataset=pnr&q=viip
  const queryDatasets = _.castArray(req.query.dataset);
  const queryTerm = req.query.q;
  // console.log(queryDatasets);

  return sparqlSearchEngine.getFederatedResults(queryTerm, queryDatasets).then((data) => {
    // console.log(data);
    res.json(data);
  })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get('/manuscripts', (req, res) => {
  const queryDatasets = _.castArray(req.query.dataset);

  return sparqlSearchEngine.getFederatedManuscripts(queryDatasets).then((data) => {
    // console.log(data);
    res.json(data);
  })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });
});

app.get('/places', (req, res) => {
  const queryDatasets = _.castArray(req.query.dataset);

  return sparqlSearchEngine.getFederatedPlaces(queryDatasets).then((data) => {
    // console.log(data);
    res.json(data);
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

app.listen(app.get('port'), () => console.log('Hipla app listening on port ' + app.get('port')));
