import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET,
  UPDATE_FILTER,
  UPDATE_SPATIAL_FILTER,
} from '../actions';
import {
  updateFilter,
  updateSpatialFilter,
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
    },
    area: {
      id: 'area',
      label: 'Area',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'ten',
    },
    // type: {
    //   id: 'type',
    //   label: 'Type',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: false,
    //   isFetching: false,
    //   searchField: false,
    //   containerSize: 'large',
    //} ,
  },
  filters: {
    source: new Set(),
    area: new Set(),
    type: new Set(),
  },
  spatialFilters: {
    productionPlace: {}
  }
};

const placesFacets = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'places') {
    switch (action.type) {
      case FETCH_FACET:
        return fetchFacet(state, action);
      case FETCH_FACET_FAILED:
        return fetchFacetFailed(state, action);
      case UPDATE_FACET:
        return updateFacet(state, action);
      case UPDATE_FILTER:
        return updateFilter(state, action);
      case UPDATE_SPATIAL_FILTER:
        return updateSpatialFilter(state, action);
      default:
        return state;
    }
  } else return state;
};

export default placesFacets;
