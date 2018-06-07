import {
  UPDATE_QUERY,
  UPDATE_DATASETS,
  FETCH_SUGGESTIONS,
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  UPDATE_RESULTS,
  CLEAR_RESULTS
} from '../actions';
import suggestions from './suggestions';
import results from './results';

export const INITIAL_STATE = {
  query: '',
  datasets: ['warsa_karelian_places', 'warsa_municipalities', 'kotus'],
  suggestions: [],
  suggestionsQuery: '',
  fetchingSuggestions: false,
  results: [],
  resultsQuery: '',
  fetchingResults: true,
};

const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      return { ...state, query: action.query || '' };
    case UPDATE_DATASETS:
      return { ...state, datasets: action.datasets || [] };
    case FETCH_SUGGESTIONS:
      return { ...state, fetchingSuggestions: true };
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
        suggestions: suggestions(state.suggestions, action),
        suggestionsQuery: state.query,
        fetchingSuggestions: false
      };
    case CLEAR_RESULTS:
      return {
        ...state,
        results: [],
        resultsQuery: '',
      };
    case UPDATE_RESULTS:
      return {
        ...state,
        results: results(state.results, action),
        resultsQuery: state.query
      };
    default:
      return state;
  }
};

export default search;
