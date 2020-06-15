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
    prefLabel: {
      id: 'prefLabel',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'one',
      filterType: 'textFilter',
      textFilter: null,
      priority: 1
    },
    author: {
      id: 'author',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: true,
      spatialFilterButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 2
    },
    language: {
      id: 'language',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: true,
      spatialFilterButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 3
    },
    productionTimespan: {
      id: 'productionTimespan',
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
      priority: 6
    },
    collection: {
      id: 'collection',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: true,
      spatialFilterButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 5
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
      containerClass: 'five',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 7
    }
  }
}

const perspective2FacetsConstrainSelf = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'perspective2') {
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

export default perspective2FacetsConstrainSelf
