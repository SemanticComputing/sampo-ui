import { UPDATE_QUERY, FETCH_SUGGESTIONS, UPDATE_DATASETS, UPDATE_SUGGESTIONS, CLEAR_SUGGESTIONS } from '../actions';

export const INITIAL_STATE = {
  query: '',
  datasets: ['warsa_karelian_places', 'warsa_municipalities'],
  suggestions: [],
  isFetchingSuggestions: false,
};

const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      return { ...state, query: action.query || '' };
    case FETCH_SUGGESTIONS:
      return { ...state, isFetchingSuggestions: true };
    case UPDATE_DATASETS:
      return { ...state, datasets: action.datasets || [] };
    case UPDATE_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.results || [],
        isFetchingSuggestions: false
      };
    case CLEAR_SUGGESTIONS:
      return { ...state, suggestions: [] };
    default:
      return state;
  }
};

export default search;
