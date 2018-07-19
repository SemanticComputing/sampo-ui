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
