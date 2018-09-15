import {
  UPDATE_QUERY,
  TOGGLE_DATASET,
  FETCH_SUGGESTIONS,
  FETCH_RESULTS,
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  UPDATE_RESULTS,
  CLEAR_RESULTS,
  UPDATE_RESULTS_FILTER,
  SORT_RESULTS
} from '../actions';

import sampleResults from './sampleResults';

export const INITIAL_STATE = {
  query: '',
  datasets: {
    'mmm': {
      'title': 'MMM',
      'shortTitle': 'MMM',
      'timePeriod': '',
      'selected': true
    },
    'tgn': {
      'title': 'The Getty Thesaurus of Geographic Names',
      'shortTitle': 'TGN',
      'timePeriod': '?',
      'selected': false
    },
  },
  suggestions: [],
  suggestionsQuery: '',
  fetchingSuggestions: false,
  results: {
    'manuscripts': [],
    'creationPlaces': {}
  },
  //results: sampleResults,
  resultsFilter: {
    'id': new Set(),
    'label': new Set(),
    'author': new Set(),
    'timespan': new Set(),
    'creationPlace': new Set(),
    'material': new Set(),
    'language': new Set(),
  },
  sortBy: 'author',
  sortDirection: 'asc',
  groupBy: 'creationPlace',
  resultsQuery: '',
  fetchingResults: false,
};

const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      return { ...state, query: action.query || '' };
    case TOGGLE_DATASET:
      return {
        ...state,
        suggestions: [],
        results: [],
        datasets: {
          ...state.datasets,
          [action.dataset]: {
            ...state.datasets[action.dataset],
            selected: state.datasets[action.dataset].selected ? false : true
          }
        }
      };
    case FETCH_SUGGESTIONS:
      return { ...state, fetchingSuggestions: true };
    case FETCH_RESULTS:
      return { ...state, fetchingResults: true };
    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: [],
        suggestionsQuery: '',
        fetchingSuggestions: false
      };
    case UPDATE_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.suggestions,
        suggestionsQuery: state.query,
        fetchingSuggestions: false
      };
    case CLEAR_RESULTS:
      return {
        ...state,
        results:  {
          'manuscripts': [],
          'creationPlaces': {}
        },
        resultsQuery: '',
        fetchingResults: false
      };
    case UPDATE_RESULTS:
      return {
        ...state,
        results: action.results,
        resultsQuery: state.query,
        fetchingResults: false
      };
    case UPDATE_RESULTS_FILTER:
      return updateResultsFilter(state, action);
    case SORT_RESULTS:
      //console.log(action)
      return {
        ...state,
        sortBy: action.options.sortBy,
        sortDirection: action.options.sortDirection,
      };
    default:
      return state;
  }
};

const updateResultsFilter = (state, action) => {
  const { property, value } = action.filter;
  let nSet = state.resultsFilter[property];
  if (nSet.has(value)) {
    nSet.delete(value);
  } else {
    nSet.add(value);
  }
  const newFilter = updateObject(state.resultsFilter, { [property]: nSet });
  return updateObject(state, { resultsFilter: newFilter });
};

const updateObject = (oldObject, newValues) => {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  //console.log(Object.assign({}, oldObject, newValues));
  return Object.assign({}, oldObject, newValues);
};

export default search;
