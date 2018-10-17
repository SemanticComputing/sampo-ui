import _ from 'lodash';
import SparqlApi from './SparqlApi';

class SparqlSearchEngine {

  doSearch(sparqlQuery, endpoint, mapper) {
    const sparqlApi = new SparqlApi({ endpoint });
    return sparqlApi.selectQuery(sparqlQuery)
      .then((data) => {
        if (data.results.bindings.length === 0) {
          return [];
        }
        return mapper ? mapper(data.results.bindings) : data.results.bindings;
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

export default SparqlSearchEngine;
