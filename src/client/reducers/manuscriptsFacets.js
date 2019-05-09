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
    // text: {
    //   id: 'text',
    //   label: 'Label',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   //sortBy: 'instanceCount',
    //   //sortDirection: 'desc',
    //   sortButton: false,
    //   spatialFilterButton: false,
    //   isFetching: false,
    //   searchField: false,
    //   containerClass: 'one',
    //   filterType: 'text',
    //   uriFilter: null,
    //   textFilter: null,
    // },
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
      containerClass: 'four',
      filterType: 'uriFilter',
      uriFilter: null
    },
    productionPlace: {
      id: 'productionPlace',
      label: 'Production place',
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
    // productionDate: {
    //   id: 'productionDate',
    //   label: 'Production date',
    //   //predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'prefLabel',
    //   sortDirection: 'asc',
    //   sortButton: false,
    //   spatialFilterButton: true,
    //   isFetching: false,
    //   searchField: true,
    //   containerClass: 'ten',
    //   filterType: 'timespan',
    //   startValue: null,
    //   endValue: null
    // },
    author: {
      id: 'author',
      label: 'Author',
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
      uriFilter: null
    },
    owner: {
      id: 'owner',
      label: 'Owner',
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
      uriFilter: null
    },
    // language: {
    //   id: 'language',
    //   label: 'Language',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'asc',
    //   isFetching: false,
    // },
  }
};

const manuscriptsFacets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'manuscripts') {
    switch (action.type) {
      case FETCH_FACET:
        return fetchFacet(state, action);
      case FETCH_FACET_FAILED:
        return fetchFacetFailed(state, action);
      case UPDATE_FACET_VALUES:
        return updateFacetValues(state, action);
      case UPDATE_FACET_OPTION:
        // console.log(action)
        return updateFacetOption(state, action);
      default:
        return state;
    }
  } else return state;
};

export default manuscriptsFacets;
