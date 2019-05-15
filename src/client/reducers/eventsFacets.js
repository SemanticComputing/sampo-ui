import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET_VALUES,
  UPDATE_FACET_OPTION,
} from '../actions';
import {
  fetchFacet,
  fetchFacetFailed,
  updateFacetValues,
  updateFacetOption,
} from './helpers';

export const INITIAL_STATE = {
  updatedFacet: null,
  facetUpdateID: 0,
  updatedFilter: null,
  facets: {
    label: {
      id: 'label',
      label: 'Label',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      //sortBy: 'instanceCount',
      //sortDirection: 'desc',
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'one',
      filterType: 'textFilter',
      textFilter: null,
    },
    place: {
      id: 'place',
      label: 'Place',
      //predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      spatialFilterButton: true,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null
    },
  }
};

const eventsFacets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'events') {
    switch (action.type) {
      case FETCH_FACET:
        return fetchFacet(state, action);
      case FETCH_FACET_FAILED:
        return fetchFacetFailed(state, action);
      case UPDATE_FACET_VALUES:
        return updateFacetValues(state, action);
      case UPDATE_FACET_OPTION:
        return updateFacetOption(state, action);
      default:
        return state;
    }
  } else return state;
};

export default eventsFacets;
