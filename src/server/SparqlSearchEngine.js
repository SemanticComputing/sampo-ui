import SparqlApi from './SparqlApi';
import datasetConfig from './Datasets';
import {
  mapAllResults,
  mergeAllResults
} from './Mappers';
import { makeObjectList } from './SparqlObjectMapper';

class SparqlSearchEngine {

  doSearch(sparqlQuery, sparqlApi, mapper) {
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
    const { endpoint, getAllQuery } = datasetConfig[datasetId];
    const sparqlApi = new SparqlApi({ endpoint });
    //console.log(getAllQuery)
    return this.doSearch(getAllQuery, sparqlApi, makeObjectList);
  }

  getFederatedManuscripts(datasets) {
    return Promise.all(datasets.map((datasetId) =>
      this.getAllManuscripts(datasetId))).then(mergeAllResults);
  }
}

export default new SparqlSearchEngine();
