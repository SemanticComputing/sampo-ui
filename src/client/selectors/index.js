import { createSelector } from 'reselect';
import _ from 'lodash';

// https://redux.js.org/recipes/computing-derived-data

const getResultsFilter = (state) => state.resultsFilter;
const getResults = (state) => state.results;
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
    let typeLabels = [];
    let broaderAreaLabels = [];
    let sources = [];
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
