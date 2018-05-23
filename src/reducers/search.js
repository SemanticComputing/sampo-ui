import {
  UPDATE_QUERY,
  UPDATE_DATASETS,
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
  UPDATE_RESULTS,
  CLEAR_RESULTS
} from '../actions';
import suggestions from './suggestions';
import results from './results';

export const INITIAL_STATE = {
  query: '',
  datasets: ['warsa_karelian_places', 'warsa_municipalities'],
  suggestions: [],
  results: []
};

const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      return { ...state, query: action.query || '' };
    case UPDATE_DATASETS:
      return { ...state, datasets: action.datasets || [] };
    case CLEAR_SUGGESTIONS:
    case UPDATE_SUGGESTIONS:
      return { ...state, suggestions: suggestions(state.suggestions, action) };
    case CLEAR_RESULTS:
    case UPDATE_RESULTS:
      return {
        ...state,
        suggestions: [], 
        results: results(state.results, action)

      };
    default:
      return state;
  }
};

export default search;
