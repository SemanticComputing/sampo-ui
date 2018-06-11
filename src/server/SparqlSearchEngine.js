import SparqlApi from './SparqlApi';
import datasetConfig from './Datasets';
import {
  mergeSimpleSuggestions,
  mergeResults,
  mapResults
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

  getSimpleSuggestions(queryTerm, datasetId) {
    const { endpoint, simpleSuggestionQuery } = datasetConfig[datasetId];
    const query = simpleSuggestionQuery.replace(/<QUERYTERM>/g, queryTerm);
    const sparqlApi = new SparqlApi({ endpoint });
    //console.log(query)

    return this.doSearch(query, sparqlApi, null)
      .then((results) => results.map(res => (res.label.value)));
  }

  getSuggestions(queryTerm, datasetId) {
    const { endpoint, suggestionQuery } = datasetConfig[datasetId];
    const query = suggestionQuery.replace(/<QUERYTERM>/g, queryTerm);
    const sparqlApi = new SparqlApi({ endpoint });

    // handle the situation when there are no results, and only one row
    // with no label and count is returned
    const checkLabel = (res) => res[0].label ? res : [];

    return this.doSearch(query, sparqlApi, checkLabel)
      .then((results) => results.map(res => ({
        label: res.label,
        datasets: { datasetId, count: res.count }
      })));
  }

  getResults(queryTerm, datasetId) {
    const { endpoint, resultQuery } = datasetConfig[datasetId];
    const query = resultQuery.replace(/<QUERYTERM>/g, queryTerm);
    const sparqlApi = new SparqlApi({ endpoint });
    return this.doSearch(query, sparqlApi, mapResults);
  }

  getFederatedSuggestions(queryTerm, datasets) {
    return Promise.all(datasets.map((datasetId) =>
      this.getSimpleSuggestions(queryTerm, datasetId))).then(mergeSimpleSuggestions);
  }

  getFederatedResults(queryTerm, datasets) {
    return Promise.all(datasets.map((datasetId) =>
      this.getResults(queryTerm, datasetId))).then(mergeResults);
  }

}

export default new SparqlSearchEngine();
