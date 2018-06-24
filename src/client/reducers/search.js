import {
  UPDATE_QUERY,
  TOGGLE_DATASET,
  FETCH_SUGGESTIONS,
  FETCH_RESULTS,
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  UPDATE_RESULTS,
  CLEAR_RESULTS
} from '../actions';

export const INITIAL_STATE = {
  query: '',
  datasets: {
    'kotus': {
      'title': 'Institute for the Languages of Finland (Kotus) Digital Names archive',
      'shortTitle': 'DNA',
      'timePeriod': '1900s',
      'selected': false
    },
    'pnr': {
      'title': 'Finnish Geographic Names Registry',
      'shortTitle': 'FGN',
      'timePeriod': 'contemporary',
      'selected': false
    },
    'tgn': {
      'title': 'The Getty Thesaurus of Geographic Names',
      'shortTitle': 'TGN',
      'timePeriod': '?',
      'selected': true
    },
    'warsa_karelian_places': {
      'title': 'Karelian map names',
      'shortTitle': 'KMN',
      'timePeriod': '1922-1944',
      'selected': false
    },
    'warsa_municipalities': {
      'title': 'Finnish WW2 municipalities',
      'shortTitle': 'FWM',
      'timePeriod': '1939-1944',
      'selected': false
    },
  },
  suggestions: [],
  suggestionsQuery: '',
  fetchingSuggestions: false,
  results: [],
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
        results: [],
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
    default:
      return state;
  }
};

export default search;
