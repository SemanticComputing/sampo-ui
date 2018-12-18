import SparqlApi from './SparqlApi';

class SparqlSearchEngine {

  doSearch(sparqlQuery, endpoint, mapper) {
    const sparqlApi = new SparqlApi({ endpoint });
    return sparqlApi.selectQuery(sparqlQuery)
      .then((data) => {
        // console.log(data.results.bindings)
        if (data.results.bindings.length === 0) {
          return [];
        }
        return mapper ? mapper(data.results.bindings) : data.results.bindings;
      });
  }
}

export default SparqlSearchEngine;
