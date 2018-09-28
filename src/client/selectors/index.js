import { createSelector } from 'reselect';
import _ from 'lodash';

// https://redux.js.org/recipes/computing-derived-data

const getResultsFilter = (state) => state.manuscriptsFilter;
const getResults = (state) => state.manuscripts;
const getSortBy = (state) => state.sortBy;
const getSortDirection = (state) => state.sortDirection;

export const getVisibleResults = createSelector(
  [ getResults, getResultsFilter, getSortBy, getSortDirection ],
  (results, resultsFilter, sortBy, sortDirection) => {
    const filteredResults =  results.filter(filterVisibleResult(resultsFilter));
    return _.orderBy(filteredResults, sortBy, sortDirection);
  }
);

const filterVisibleResult = resultsFilter => (resultObj) => {
  for (const property in resultsFilter) {
    const filterValues = resultsFilter[property];
    if (filterValues.has(resultObj[property])) {
      return false;
    }
  }
  return true;
};

export const getVisibleValues = createSelector(
  [ getResults, getResultsFilter ],
  (visibleResults, resultsFilter) => {
    const properties = Object.keys(resultsFilter);
    let visibleValues = {};
    properties.forEach((property) => {
      visibleValues[property] = [];
    });
    for (const result of visibleResults) {
      properties.forEach((property) => {
        visibleValues[property].push({
          value: result[property],
          selected: !resultsFilter[property].has(result[property])
        });
      });
    }
    properties.forEach((property) => {
      visibleValues[property] = _.sortBy(_.uniqBy(visibleValues[property], 'value'), 'value');
    });
    return visibleValues;
  }
);
