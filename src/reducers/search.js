import {
  UPDATE_QUERY,
  UPDATE_DATASETS,
  UPDATE_SUGGESTIONS,
  CLEAR_SUGGESTIONS,
} from '../actions';
import suggestions from './suggestions';

export const INITIAL_STATE = {
  query: '',
  datasets: ['warsa_karelian_places', 'warsa_municipalities'],
  suggestions: [],
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
    default:
      return state;
  }
};

export default search;
