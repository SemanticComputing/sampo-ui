import {
  FETCH_FACET,
  UPDATE_FACET,
  CLEAR_FACET
} from '../actions';

export const INITIAL_STATE = {
  values : [],
  fetchingFacet : false
};

const facet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_FACET:
      return { ...state, fetchingFacet: true };
    case UPDATE_FACET:
      return {
        ...state,
        values: action.values,
        fetchingFacet: false
      };
    case CLEAR_FACET:
      return {
        ...state,
        values: [],
        fetchingFacet: false
      };
    default:
      return state;
  }
};
export default facet;
