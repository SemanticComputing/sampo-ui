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
        if (key === 'basicElement') {
          result[key] = value.value;
        } else {
          result[key] = capitalizeFirstLetter(value.value);
        }
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

  // Suggestions from different datasets may have duplicates
  let uniqueSuggestions = [...new Set(_.flatten(suggestions))];

  // Sort suggestions alphabetically, because Lunece score does
  // not work with wildcard queries.
  return uniqueSuggestions.sort();
};

export const mergeResults = (results) => {
  // SPARQL query defines the ordering of results of one dataset.
  // Return all merged results subsequentially.
  //console.log(_.flatten(results))
  return _.flatten(results);
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const mapResults = (results) => groupBy(results, 's', true);
