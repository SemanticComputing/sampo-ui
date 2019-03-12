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
      isFetching: false,
      searchField: false,
      containerClass: 'five',
      filterType: 'uri',
      uriFilter: new Set()
    },
    place: {
      id: 'place',
      label: 'Place / nationality',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uri',
      uriFilter: new Set()
    },
  }
};

const peopleFacets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'people') {
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

export default peopleFacets;
