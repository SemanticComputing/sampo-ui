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
    author: {
      id: 'author',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: true,
      spatialFilterButton: false,
      pieChartButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 4
    },
    work: {
      id: 'work',
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
      // predicate: defined in backend
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
      selectAlsoSubconceptsButton: true,
      selectAlsoSubconcepts: true,
      priority: 5
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
      lineChartButton: true,
      isFetching: false,
      searchField: false,
      containerClass: 'four',
      filterType: 'timespanFilter',
      min: null,
      max: null,
      timespanFilter: null,
      type: 'timespan',
      priority: 8
    },
    note: {
      id: 'note',
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
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: true,
      spatialFilterButton: false,
      barChartButton: true,
      pieChartButton: true,
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
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: true,
      spatialFilterButton: false,
      pieChartButton: true,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      useConjuctionButton: true, // experimental, does not work well with hierarchical facets
      useConjuction: false,
      priority: 3
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
      pieChartButton: true,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 7
    },
    transferOfCustodyPlace: {
      id: 'transferOfCustodyPlace',
      // predicate: defined in backend
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
      selectAlsoSubconceptsButton: true,
      selectAlsoSubconcepts: true,
      priority: 6
    },
    transferOfCustodyTimespan: {
      id: 'transferOfCustodyTimespan',
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
      containerClass: 'four',
      filterType: 'timespanFilter',
      min: null,
      max: null,
      timespanFilter: null,
      type: 'timespan',
      priority: 9
    },
    lastKnownLocation: {
      id: 'lastKnownLocation',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      spatialFilterButton: false,
      // spatialFilterTab: 'production_places',
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      spatialFilter: null,
      type: 'hierarchical',
      selectAlsoSubconceptsButton: true,
      selectAlsoSubconcepts: true,
      priority: 22
    },
    material: {
      id: 'material',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: true,
      spatialFilterButton: false,
      pieChartButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 20
    },
    height: {
      id: 'height',
      // predicate: defined in backend
      sortButton: false,
      spatialFilterButton: false,
      isFetching: false,
      containerClass: 'five',
      type: 'integer',
      filterType: 'integerFilter',
      integerFilter: null,
      unit: 'mm',
      priority: 11
    },
    width: {
      id: 'width',
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
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      spatialFilterButton: false,
      pieChartButton: true,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 21
    }
  }
}

const perspective1Facets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'perspective1') {
    return handleFacetAction(state, action, INITIAL_STATE)
  } else return state
}

export default perspective1Facets
