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
  SORT_RESULTS,
  UPDATE_PAGE,
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
  page: -1,
  places: [],
  place: {},
  sortBy: 'author',
  sortDirection: 'asc',
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
        fetchingManuscripts: false
      };
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
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
        fetchingManuscripts: false
      };
    case CLEAR_PLACES:
      return {
        ...state,
        'places': {},
        fetchingPlaces: false
      };
    case SORT_RESULTS:
      return {
        ...state,
        sortBy: action.options.sortBy,
        sortDirection: action.options.sortDirection,
      };
    default:
      return state;
  }
};

export default search;
