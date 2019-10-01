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
    prefLabel: {
      id: 'prefLabel',
      label: 'Label',
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
      uriFilter: null,
      priority: 4
    },
    work: {
      id: 'work',
      label: 'Work',
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
      spatialFilterTab: 'production_places',
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null,
      type: 'hierarchical',
      priority: 5
    },
    productionTimespan: {
      id: 'productionTimespan',
      label: 'Production date',
      //predicate: defined in backend
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
    note: {
      id: 'note',
      label: 'Note',
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
      priority: 3
    },
    language: {
      id: 'language',
      label: 'Language',
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
    // event only as a result table column
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
      uriFilter: null,
      priority: 3
    },
    collection: {
      id: 'collection',
      label: 'Collection',
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
      priority: 7
    },
    transferOfCustodyPlace: {
      id: 'transferOfCustodyPlace',
      label: 'Transfer of Custody Place',
      //predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null,
      type: 'hierarchical',
      priority: 6
    },
    transferOfCustodyTimespan: {
      id: 'transferOfCustodyTimespan',
      label: 'Transfer of Custody Date',
      //predicate: defined in backend
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
      priority: 9
    },
    material: {
      id: 'material',
      label: 'Material',
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
      priority: 20,
    },
    height: {
      id: 'height',
      label: 'Height',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: 'mm',
      priority: 11
    },
    width: {
      id: 'width',
      label: 'Width',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: 'mm',
      priority: 12
    },
    folios: {
      id: 'folios',
      label: 'Folios',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: '',
      priority: 13
    },
    lines: {
      id: 'lines',
      label: 'Lines',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: '',
      priority: 14
    },
    columns: {
      id: 'columns',
      label: 'Columns',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: '',
      priority: 15
    },
    miniatures: {
      id: 'miniatures',
      label: 'Miniatures',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: '',
      priority: 16
    },
    decoratedInitials: {
      id: 'decoratedInitials',
      label: 'Decorated initials',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: '',
      priority: 17
    },
    historiatedInitials: {
      id: 'historiatedInitials',
      label: 'Historiated initials',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilterRange',
      integerFilter: null,
      unit: '',
      priority: 18
    },
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
      containerClass: 'three',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 21
    },
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
        return updateFacetOption(state, action);
      default:
        return state;
    }
  } else return state;
};

export default manuscriptsFacets;
