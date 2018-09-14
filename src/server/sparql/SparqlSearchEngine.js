import _ from 'lodash';
import SparqlApi from './SparqlApi';
import datasetConfig from './Datasets';
import {
  //mapAllResults,
  mergeAllResults
} from './Mappers';
import { makeObjectList, makeDict } from './SparqlObjectMapper';

class SparqlSearchEngine {

  doSearch(sparqlQuery, endpoint, mapper) {
    const sparqlApi = new SparqlApi({ endpoint });
    return sparqlApi.selectQuery(sparqlQuery)
      .then((data) => {
        if (data.results.bindings.length === 0) {
          return [];
        }
        // console.log(data.results.bindings)
        return mapper ? mapper(data.results.bindings) : data.results.bindings;
      });
  }

  getAllManuscripts(datasetId) {
    const { endpoint, allQuery } = datasetConfig[datasetId];
    return this.doSearch(allQuery, endpoint, makeObjectList);
  }

  getFederatedManuscripts(datasets) {
    return Promise.all(datasets.map((datasetId) =>
      this.getAllManuscripts(datasetId)))
      .then(mergeAllResults)
      .then((manuscripts) => this.getPlaces(manuscripts));
  }

  getPlaces(manuscripts) {
    const { endpoint, placeQuery } = datasetConfig.mmm;
    let placeIds = manuscripts.reduce((places, manuscript) => {
      if (manuscript.creationPlace !== undefined) {
        const creationPlaceArr = manuscript.creationPlace.split(',');
        places = places.concat(creationPlaceArr);
      }
      return places;
    }, []);
    placeIds = Array.from(new Set(placeIds)); //remove duplicates
    return this.doSearch(placeQuery.replace('<ID>', this.uriFy(placeIds)), endpoint, makeDict)
      .then((placeDict) => {
        manuscripts.map((manuscript) => {
          if (manuscript.creationPlace !== undefined) {
            let creationPlaceObjs;
            const creationPlaceArr = manuscript.creationPlace.split(',');
            if (creationPlaceArr.length > 1) {
              creationPlaceObjs = creationPlaceArr.map((place) => {
                return placeDict[place];
              });
            } else {
              creationPlaceObjs = placeDict[creationPlaceArr[0]];
            }
            manuscript.creationPlace = creationPlaceObjs;
            return manuscript;
          }
        });
        return manuscripts;
      });
  }

  uriFy(id) {
    if (_.isArray(id)) {
      return '<' + id.join('> <') + '>';
    } else if (id) {
      return '<' + id + '>';
    }
    return;
  }
}

export default new SparqlSearchEngine();
