import { createSelector } from 'reselect';
import _ from 'lodash';

// https://redux.js.org/recipes/computing-derived-data

const getResultsFilter = (state) => state.resultsFilter;
const getResults = (state) => state.results;

export const getVisibleResults = createSelector(
  [ getResults, getResultsFilter ],
  (results, resultsFilter) => {
    //console.log('filtering')
    //console.log(results.filter(filterVisibleResult(resultsFilter)));
    return results.filter(filterVisibleResult(resultsFilter));
  }
);

const filterVisibleResult = resultsFilter => (resultObj) => {
  for (const property in resultsFilter) {
    //console.log(resultObj[property])
    const filterValues = resultsFilter[property];
    // console.log(property, filterValues)
    if (filterValues.has(resultObj[property])) {
      return false;
    }
  }
  return true;
};

export const getVisibleValues = createSelector(
  [ getResults, getResultsFilter ],
  (visibleResults, resultsFilter) => {
    let typeLabels = [];
    let broaderAreaLabels = [];
    let sources = [];
    //console.log(resultsFilter)
    for (const result of visibleResults) {
      typeLabels.push({ value: result.typeLabel, selected: !resultsFilter.typeLabel.has(result.typeLabel) });
      broaderAreaLabels.push({ value: result.broaderAreaLabel, selected: !resultsFilter.broaderAreaLabel.has(result.broaderAreaLabel) });
      sources.push({ value: result.source, selected: !resultsFilter.source.has(result.source) });
    }
    return {
      typeLabels: _.sortBy(_.uniqBy(typeLabels, 'value'), 'value'),
      broaderAreaLabels:  _.sortBy(_.uniqBy(broaderAreaLabels, 'value'), 'value'),
      sources:  _.sortBy(_.uniqBy(sources, 'value'), 'value'),
    };
  }
);


// export const getVisibleValues = createSelector(
//   [ getVisibleResults ],
//   (visibleResults) => {
//     let typeLabels = [];
//     let broaderAreaLabels = [];
//     let sources = [];
//     for (const result of visibleResults) {
//       typeLabels.push(result.typeLabel);
//       broaderAreaLabels.push(result.broaderAreaLabel);
//       sources.push(result.source);
//     }
//     return {
//       typeLabels: Array.from(new Set(typeLabels)),
//       broaderAreaLabels: Array.from(new Set(broaderAreaLabels)),
//       sources: Array.from(new Set(sources)),
//     };
//   }
// );
