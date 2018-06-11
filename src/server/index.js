import express from 'express';
import bodyParser from 'body-parser';
import request from 'superagent';
import _ from 'lodash';
import sparqlSearchEngine from './SparqlSearchEngine';

const app = express();
app.use(bodyParser.json());

// allow CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/suggest', (req, res) => {
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

app.get('/api/search', (req, res) => {
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

app.get('/api/wfs', (req, res) => {
  //
  // Taustakartan rajat:
  //
  //   kotus:pitajat
  //   kotus:rajat-sms-alueosat  murrealueenosat
  //   kotus:rajat-lansi-ita
  //   kotus:rajat-sms-alueet    murrealueet
  const url = 'http://avaa.tdata.fi/geoserver/kotus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kotus:pitajat&srsName=EPSG:4326&outputformat=json';
  request
    .get(url)
    .then(function(data) {
      //console.log(data.body);
      //return(res.json(geo));
      return(res.json(data.body));
    })
    .catch(function(err) {
      console.log(err.message, err.response);
    });
});

app.listen(8080, () => console.log('Hipla backend listening on port 8080'));
