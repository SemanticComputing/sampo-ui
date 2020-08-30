import { handleFacetAction } from '../general/facets'

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
      sortBy: null,
      sortDirection: null,
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'one',
      filterType: 'textFilter',
      textFilter: null,
      priority: 1
    },
    gender: {
      id: 'gender',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      spatialFilterButton: false,
      chartButton: true,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 9
    },
    type: {
      id: 'type',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      spatialFilterButton: false,
      chartButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 9
    },
    birthDateTimespan: {
      id: 'birthDateTimespan',
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
      priority: 8
    },
    deathDateTimespan: {
      id: 'deathDateTimespan',
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
      priority: 8
    }
  }
}

const actorsFacets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'emloActors') {
    return handleFacetAction(state, action)
  } else return state
}

export default actorsFacets
