import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET,
  UPDATE_FILTER,
} from '../actions';
import {
  updateFilter,
  fetchFacet,
  fetchFacetFailed,
  updateFacet
} from './helpers';

export const INITIAL_STATE = {
  updatedFacet: null,
  facetUpdateID: 0,
  facets: {
    source: {
      id: 'source',
      label: 'Source',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'five',
      filterType: 'uri',
      uriFilter: new Set()
    },
  },
};

const worksFacets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'works') {
    switch (action.type) {
      case FETCH_FACET:
        return fetchFacet(state, action);
      case FETCH_FACET_FAILED:
        return fetchFacetFailed(state, action);
      case UPDATE_FACET:
        return updateFacet(state, action);
      case UPDATE_FILTER:
        return updateFilter(state, action);
      default:
        return state;
    }
  } else return state;
};

export default worksFacets;
