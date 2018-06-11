import _ from 'lodash';

export const groupBy = (sparqlBindings, group, simplify) => Object.values(_.reduce(sparqlBindings, (results, sparqlResult) => {
  const id = _.get(sparqlResult[group], 'value');
  if (id === undefined) {
    return [];
  }
  if (!results[id]) {
    results[id] = {};
  }
  let result = results[id];
  _.forOwn(sparqlResult, (value, key) => {
    if (key === group) {
      result[group] = value.value;
    } else {
      if (simplify) {
        result[key] = value.value;
      } else {
        const oldVal = result[key];
        // add new value if it doesn't already exist
        if (!_.find(oldVal, (val) => _.isEqual(val, value))) {
          (result[key] || (result[key] = [])).push(value);
        }
      }
    }
  });
  return results;
}, {}));

export const mergeSuggestions = (suggestions) => {
  return groupBy(_.compact(_.flatten(suggestions)), 'label', false);
};


export const mergeSimpleSuggestions = (suggestions) => {
  // Sort suggestions alphabetically, because Lunece score does
  // not work with wildcard queries.
  return _.flatten(suggestions).sort();
};

export const mergeResults = (results) => {
  // SPARQL query defines the ordering of results of one dataset.
  // Return all merged results subsequentially.
  return _.flatten(results);
};

export const mapResults = (results) => groupBy(results, 's', true);
