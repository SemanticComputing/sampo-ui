import _ from 'lodash';

//https://github.com/SemanticComputing/angular-paging-sparql-service/blob/master/src/sparql.object-mapper-service.js

export const groupBy = (sparqlBindings, group) => Object.values(_.reduce(sparqlBindings, (results, sparqlResult) => {
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
      result[group] = value.value; // ignore lang tags
    } else {
      const oldValues = result[key];
      // add new value if it doesn't already exist
      if (!_.includes(oldValues, value.value)) {
        (result[key] || (result[key] = [])).push(value.value);
      }
    }
  });
  return results;
}, {}));

// export const mergeSuggestions = (suggestions) => {
//   return groupBy(_.compact(_.flatten(suggestions)), 'label', false);
// };
//
//
// export const mergeSimpleSuggestions = (suggestions) => {
//
//   // Suggestions from different datasets may have duplicates
//   let uniqueSuggestions = [...new Set(_.flatten(suggestions))];
//
//   // Sort suggestions alphabetically, because Lunece score does
//   // not work with wildcard queries.
//   return uniqueSuggestions.sort();
// };
//

// const capitalizeFirstLetter = (string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// };

export const mapAllResults = (results) => groupBy(results, 'id');

export const mergeAllResults = (results) => {
  // SPARQL query defines the ordering of results of one dataset.
  // Return all merged results subsequentially.
  //console.log(_.flatten(results))
  return _.flatten(results);
};
