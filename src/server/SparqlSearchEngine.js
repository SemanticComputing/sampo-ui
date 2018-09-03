import SparqlApi from './SparqlApi';
import datasetConfig from './Datasets';
import {
  mapAllResults,
  mergeAllResults
} from './Mappers';

class SparqlSearchEngine {

  doSearch(sparqlQuery, sparqlApi, mapper) {
    return sparqlApi.selectQuery(sparqlQuery)
      .then((data) => {
        if (data.results.bindings.length === 0) {
          return [];
        }
        return mapper ? mapper(data.results.bindings) : data.results.bindings;
      });
  }

  getAllManuscripts(datasetId) {
    const { endpoint, getAllQuery } = datasetConfig[datasetId];
    const sparqlApi = new SparqlApi({ endpoint });
    console.log(getAllQuery)
    return this.doSearch(getAllQuery, sparqlApi, mapAllResults);
  }

  getFederatedManuscripts(datasets) {
    return Promise.all(datasets.map((datasetId) =>
      this.getAllManuscripts(datasetId))).then(mergeAllResults);
  }
}

export default new SparqlSearchEngine();
