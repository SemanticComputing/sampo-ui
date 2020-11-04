import { handleFacetAction } from '../general/facets'

export const INITIAL_STATE = {
  updatedFacet: null,
  facetUpdateID: 0,
  updatedFilter: null,
  facets: {
    findName: {
      id: 'find_name',
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
      priority: 1
    },
    objectType: {
      id: 'objectType',
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
      type: 'hierarchical',
      priority: 6
    },
    // specification: {
    //   id: 'specification',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: true,
    //   spatialFilterButton: false,
    //   pieChartButton: true,
    //   isFetching: false,
    //   searchField: true,
    //   containerClass: 'ten',
    //   filterType: 'uriFilter',
    //   uriFilter: null,
    //   priority: 2
    // },
    // type: {
    //   id: 'type',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: true,
    //   spatialFilterButton: false,
    //   pieChartButton: true,
    //   isFetching: false,
    //   searchField: true,
    //   containerClass: 'ten',
    //   filterType: 'uriFilter',
    //   uriFilter: null,
    //   priority: 2
    // },
    // subCategory: {
    //   id: 'subCategory',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: true,
    //   spatialFilterButton: false,
    //   pieChartButton: true,
    //   isFetching: false,
    //   searchField: true,
    //   containerClass: 'ten',
    //   filterType: 'uriFilter',
    //   uriFilter: null,
    //   priority: 3
    // },
    // objectSubCategory: {
    //   id: 'objectSubCategory',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: true,
    //   spatialFilterButton: false,
    //   pieChartButton: true,
    //   isFetching: false,
    //   searchField: true,
    //   containerClass: 'ten',
    //   filterType: 'uriFilter',
    //   uriFilter: null,
    //   priority: 3,
    //   //type: 'hierarchical'
    // },
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
      pieChartButton: true,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
      filterType: 'uriFilter',
      uriFilter: null,
      priority: 4,
      type: 'hierarchical'
    },
    // materialLiteral: {
    //   id: 'materialLiteral',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: true,
    //   spatialFilterButton: false,
    //   pieChartButton: true,
    //   isFetching: false,
    //   searchField: true,
    //   containerClass: 'ten',
    //   filterType: 'uriFilter',
    //   uriFilter: null,
    //   priority: 4,
    // },
    // period: {
    //   id: 'period',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: true,
    //   spatialFilterButton: false,
    //   pieChartButton: true,
    //   isFetching: false,
    //   searchField: true,
    //   containerClass: 'ten',
    //   filterType: 'uriFilter',
    //   uriFilter: null,
    //   priority: 5
    // },
    periodObject: {
      id: 'periodObject',
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
      type: 'hierarchical',
      priority: 6
    },
    place: {
      id: 'place',
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
      type: 'hierarchical',
      priority: 6
    }
  }
}

const findsFacets = (state = INITIAL_STATE, action) => {
  if (action.facetClass === 'finds') {
    return handleFacetAction(state, action, INITIAL_STATE)
  } else return state
}

export default findsFacets
