import {
  UPDATE_QUERY,
  UPDATE_DATASETS,
  FETCH_SUGGESTIONS,
  FETCH_RESULTS,
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  UPDATE_RESULTS,
  CLEAR_RESULTS
} from '../actions';
//import suggestions from './suggestions';
import results from './results';

export const INITIAL_STATE = {
  query: '',
  datasets: [
    { id: 'kotus', selected: true},
    { id: 'pnr', selected: true},
    { id: 'warsa_karelian_places', selected: true},
    { id: 'warsa_municipalities', selected: true},
  ],
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
    case UPDATE_DATASETS:
      return {
        ...state,
        datasets: [
          { id: 'kotus', selected: true},
          { id: 'pnr', selected: true},
          { id: 'warsa_karelian_places', selected: false},
          { id: 'warsa_municipalities', selected: true},
        ],
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
        results: results(state.results, action),
        resultsQuery: state.query,
        fetchingResults: false
      };
    default:
      return state;
  }
};

export default search;
