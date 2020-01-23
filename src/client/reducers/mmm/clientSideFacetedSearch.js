import {
  FETCH_RESULTS_CLIENT_SIDE,
  UPDATE_RESULTS,
  CLEAR_RESULTS,
  UPDATE_CLIENT_SIDE_FILTER,
  SORT_RESULTS
} from '../../actions'

export const INITIAL_STATE = {
  query: '',
  results: [],
  latestFilter: {
    id: ''
  },
  latestFilterValues: [],
  resultsFilter: {
    prefLabel: new Set(),
    type: new Set()
  },
  sortBy: 'prefLabel',
  sortDirection: 'asc',
  // groupBy: 'broaderTypeLabel',
  // groupByLabel: 'Paikanlaji',
  textResultsFetching: false,
  spatialResultsFetching: false
}

const clientSideFacetedSearch = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'all') {
    switch (action.type) {
      case FETCH_RESULTS_CLIENT_SIDE:
        return {
          ...state,
          [`${action.jenaIndex}ResultsFetching`]: true
        }
      case UPDATE_RESULTS:
        return {
          ...state,
          query: action.query,
          results: action.data,
          [`${action.jenaIndex}ResultsFetching`]: false
        }
      case CLEAR_RESULTS:
        return {
          ...state,
          results: null,
          fetchingResults: false,
          query: '',
          resultsFilter: {
            prefLabel: new Set(),
            type: new Set()
          }
        }
      case UPDATE_CLIENT_SIDE_FILTER:
        return updateResultsFilter(state, action)
      case SORT_RESULTS:
        return {
          ...state,
          sortBy: action.options.sortBy,
          sortDirection: action.options.sortDirection
        }
      default:
        return state
    }
  } else return state
};

const updateResultsFilter = (state, action) => {
  const { property, value, latestValues } = action.filterObj
  let nSet = state.resultsFilter[property]
  if (nSet.has(value)) {
    nSet.delete(value)
  } else {
    nSet.add(value)
  }
  const newFilter = {
    ...state.resultsFilter,
    [property]: nSet
  }
  return {
    ...state,
    resultsFilter: newFilter,
    latestFilter: {
      id: property
    },
    latestFilterValues: latestValues
  }
};

export default clientSideFacetedSearch
