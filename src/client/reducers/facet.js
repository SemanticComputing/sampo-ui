import {
  FETCH_FACET,
  UPDATE_FACET,
} from '../actions';

export const INITIAL_STATE = {
  facetOptions : {
    creationPlace: {
      hierarchical: true,
    },
    author: {
      hierarchical: false,
    }
  },
  facetValues : {
    creationPlace: [],
    author: []
  },
  fetchingFacet : false
};

const facet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_FACET:
      return { ...state, fetchingFacet: true };
    case UPDATE_FACET:
      return {
        ...state,
        facetValues: action.facetValues,
        fetchingFacet: false
      };
    default:
      return state;
  }
};

export default facet;
