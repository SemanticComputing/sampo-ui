import {
  FETCH_FACET_CONSTRAIN_SELF,
  FETCH_FACET_CONSTRAIN_SELF_FAILED,
  UPDATE_FACET_VALUES_CONSTRAIN_SELF
} from '../../actions'
import {
  fetchFacet,
  fetchFacetFailed,
  updateFacetValues
  // updateFacetOption,
} from '../helpers'

export const INITIAL_STATE = {
  updatedFacet: null,
  facetUpdateID: 0,
  updatedFilter: null,
  facets: {
    type: {
      id: 'type',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null,
      priority: 4
    },
    manuscript: {
      id: 'manuscript',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: null,
      sortDirection: null,
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'one',
      filterType: 'textFilter',
      textFilter: null,
      priority: 2
    },
    eventTimespan: {
      id: 'eventTimespan',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: null,
      sortDirection: null,
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'timespanFilter',
      min: null,
      max: null,
      timespanFilter: null,
      type: 'timespan',
      priority: 3
    },
    place: {
      id: 'place',
      // predicate: defined in backend
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
      spatialFilter: null,
      type: 'hierarchical',
      selectAlsoSubconceptsButton: true,
      selectAlsoSubconcepts: true,
      priority: 6
    },
    placeType: {
      id: 'placeType',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      spatialFilterButton: true,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null,
      type: 'list',
      priority: 1
    },
    source: {
      id: 'source',
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
      containerClass: 'three',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 5
    }
  }
}

const perspective3FacetsConstainself = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'perspective3') {
    switch (action.type) {
      case FETCH_FACET_CONSTRAIN_SELF:
        return fetchFacet(state, action)
      case FETCH_FACET_CONSTRAIN_SELF_FAILED:
        return fetchFacetFailed(state, action)
      case UPDATE_FACET_VALUES_CONSTRAIN_SELF:
        return updateFacetValues(state, action)
      default:
        return state
    }
  } else return state
}

export default perspective3FacetsConstainself
