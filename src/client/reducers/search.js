import {
  UPDATE_QUERY,
  TOGGLE_DATASET,
  FETCH_SUGGESTIONS,
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  FETCH_RESULTS,
  UPDATE_RESULTS,
  FETCH_MANUSCRIPTS,
  FETCH_PLACES,
  FETCH_PLACE,
  UPDATE_MANUSCRIPTS,
  CLEAR_MANUSCRIPTS,
  UPDATE_PLACES,
  CLEAR_PLACES,
  UPDATE_PLACE,
  UPDATE_RESULTS_FILTER,
  SORT_RESULTS
} from '../actions';

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
  results: 0,
  fetchingResults: false,
  manuscripts: [],
  page: 0,
  places: [],
  place: {},
  manuscriptsFilter: {
    //'author': new Set(),
    //'timespan': new Set(),
    'creationPlace': new Set(),
    //'material': new Set(),
    //'language': new Set(),
  },
  sortBy: 'author',
  sortDirection: 'asc',
  groupBy: 'label',
  resultsQuery: '',
  fetchingPlaces: false,
  fetchingManuscripts: false
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
    case FETCH_MANUSCRIPTS:
      return { ...state, fetchingManuscripts: true };
    case FETCH_PLACES:
      return { ...state, fetchingPlaces: true };
    case FETCH_PLACE:
      return { ...state, fetchingPlaces: true };
    case FETCH_RESULTS:
      return { ...state, fetchResults: true };
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
    case UPDATE_MANUSCRIPTS:
      return {
        ...state,
        manuscripts: action.manuscripts,
        page: action.page,
        fetchingManuscripts: false
      };
    case UPDATE_RESULTS:
      return {
        ...state,
        results: parseInt(action.results.count),
        fetchingResults: false
      };
    case UPDATE_PLACES:
      return {
        ...state,
        places: action.places,
        fetchingPlaces: false
      };
    case UPDATE_PLACE:
      return {
        ...state,
        place: action.place,
        fetchingPlaces: false
      };
    case CLEAR_MANUSCRIPTS:
      return {
        ...state,
        'manuscripts': [],
        resultsQuery: '',
        fetchingManuscripts: false
      };
    case CLEAR_PLACES:
      return {
        ...state,
        'places': {},
        resultsQuery: '',
        fetchingPlaces: false
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
