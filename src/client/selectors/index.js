import { createSelector } from 'reselect';

const getResultsFilter = (state) => state.search.resultsFilter;
const getResults = (state) => state.search.results;

export const getVisibleResults = createSelector(
  [ getResults, getResultsFilter ],
  (results, resultsFilter) => {
    if (resultsFilter == null) {
      return results;
    } else {
      for (const property in resultsFilter) {
        const filterValues = resultsFilter[property];
        return results.filter(resultObj => filterValues.has(resultObj[property]));
      }
    }
  }
);

export const getVisibleValues = createSelector(
  [ getVisibleResults ],
  (visibleResults) => {
    let typeLabels = [];
    let broaderAreaLabels = [];
    let sources = [];
    for (const result of visibleResults) {
      typeLabels.push(result.typeLabel);
      broaderAreaLabels.push(result.broaderAreaLabel);
      sources.push(result.source);
    }
    return {
      typeLabels: Array.from(new Set(typeLabels)),
      broaderAreaLabels: Array.from(new Set(broaderAreaLabels)),
      sources: Array.from(new Set(sources)),
    };
  }
);
