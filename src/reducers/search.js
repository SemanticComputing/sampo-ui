import { UPDATE_QUERY, FETCH_RESULTS, UPDATE_DATASETS, UPDATE_RESULTS, CLEAR_RESULTS } from '../actions';

export const INITIAL_STATE = {
  query: '',
  datasets: ['warsa_karelian_places'],
  suggestions: [],
};

const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      return { ...state, query: action.query || '' };
    case FETCH_RESULTS:
      return { ...state, isFetchingResults: true };
    case UPDATE_DATASETS:
      return { ...state, datasets: action.datasets || [] };
    case UPDATE_RESULTS:
      return {
        ...state,
        suggestions: action.results || [],
        isFetchingResults: false
      };
    case CLEAR_RESULTS:
      return { ...state, suggestions: [] };
    default:
      return state;
  }
};

export default search;
