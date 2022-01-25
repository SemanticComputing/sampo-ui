import { has, isEmpty } from 'lodash'
import { UPDATE_FACET_VALUES_CONSTRAIN_SELF } from '../../actions'

export const fetchResults = (state, action, initialState) => {
  const { reason } = action
  let resetMapBounds = false
  if (
    reason &&
    reason === 'facetUpdate' &&
    initialState.maps
  ) {
    resetMapBounds = true
  }
  return {
    ...state,
    instance: null,
    instanceTableExternalData: null,
    ...(resetMapBounds && { maps: initialState.maps }),
    ...(action.order == null && {
      fetching: true,
      resultUpdateID: 0
    }),
    ...(action.order && {
      [`${action.order}Fetching`]: true,
      [`${action.order}ResultUpdateID`]: 0
    })
  }
}

export const fetchResultCount = state => {
  return {
    ...state,
    resultCount: null,
    fetchingResultCount: true
  }
}

export const fetchInstanceAnalysisData = state => {
  return {
    ...state,
    instanceAnalysisData: null,
    fetchingInstanceAnalysisData: true
  }
}

export const fetchResultsFailed = state => {
  return {
    ...state,
    fetching: false
  }
}

export const updateInstanceTableData = (state, action) => {
  return {
    ...state,
    instanceTableData: action.data.length === 1 ? action.data[0] : {},
    instanceSparqlQuery: action.sparqlQuery,
    fetching: false
  }
}

export const updateInstanceTableExternalData = (state, action) => {
  return {
    ...state,
    instanceTableExternalData: action.data,
    fetching: false
  }
}

export const updateInstanceAnalysisData = (state, action) => {
  return {
    ...state,
    instanceAnalysisData: action.data,
    instanceAnalysisDataUpdateID: ++state.instanceAnalysisDataUpdateID,
    instanceSparqlQuery: action.sparqlQuery,
    fetchingInstanceAnalysisData: false
  }
}

export const updatePage = (state, action) => {
  if (isNaN(action.page)) {
    return state
  } else {
    return {
      ...state,
      page: action.page
    }
  }
}

export const updateRowsPerPage = (state, action) => {
  return {
    ...state,
    pagesize: action.rowsPerPage
  }
}

export const updateSortBy = (state, action) => {
  if (state.sortBy === action.sortBy) {
    return {
      ...state,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
    }
  } else {
    return {
      ...state,
      sortBy: action.sortBy,
      sortDirection: 'asc'
    }
  }
}

export const updateFacetOption = (state, action) => {
  const { facetID, option, value } = action
  const filterTypes = [
    'uriFilter',
    'spatialFilter',
    'textFilter',
    'timespanFilter',
    'integerFilter',
    'dateFilter',
    'integerFilterRange'
  ]
  if (filterTypes.includes(action.option)) {
    return updateFacetFilter(state, action)
  } else {
    return {
      ...state,
      facets: {
        ...state.facets,
        [facetID]: {
          ...state.facets[facetID],
          [option]: value
        }
      }
    }
  }
}

const updateFacetFilter = (state, action) => {
  const { facetID, value } = action
  const oldFacet = state.facets[facetID]
  let newFacet = {}
  if (oldFacet.filterType === 'uriFilter') {
    let newUriFilter = oldFacet.uriFilter == null ? {} : oldFacet.uriFilter
    // 'value' is a react sortable tree object
    if (has(newUriFilter, value.node.id)) {
      value.added = false
      delete newUriFilter[value.node.id]
      if (isEmpty(newUriFilter)) {
        newUriFilter = null
      }
    } else {
      value.added = true
      newUriFilter[value.node.id] = value
    }
    newFacet = {
      ...state.facets[facetID],
      uriFilter: newUriFilter
    }
  } else if (oldFacet.filterType === 'spatialFilter') {
    newFacet = {
      ...state.facets[facetID],
      spatialFilter: value
    }
  } else if (oldFacet.filterType === 'textFilter') {
    newFacet = {
      ...state.facets[facetID],
      textFilter: value
    }
  } else if (oldFacet.filterType === 'timespanFilter' || oldFacet.filterType === 'dateFilter') {
    if (value == null) {
      newFacet = {
        ...state.facets[facetID],
        timespanFilter: null
      }
    } else {
      newFacet = {
        ...state.facets[facetID],
        timespanFilter: {
          start: value[0],
          end: value[1]
        }
      }
    }
  } else if (oldFacet.filterType === 'integerFilter' ||
          oldFacet.filterType === 'integerFilterRange') {
    if (value == null) {
      newFacet = {
        ...state.facets[facetID],
        integerFilter: null
      }
    } else {
      newFacet = {
        ...state.facets[facetID],
        integerFilter: {
          start: value[0],
          end: value[1]
        }
      }
    }
  }
  return {
    ...state,
    updatedFacet: facetID,
    facetUpdateID: ++state.facetUpdateID,
    updatedFilter: value, // a react sortable tree object, latlngbounds or text filter
    facets: {
      ...state.facets,
      [facetID]: newFacet
    }
  }
}

export const updateResultCount = (state, action) => {
  return {
    ...state,
    resultCount: parseInt(action.data),
    fetchingResultCount: false
  }
}

export const updateResults = (state, action, initialState) => {
  if (action.order) {
    const { order } = action
    return {
      ...state,
      results: null,
      resultsSparqlQuery: action.sparqlQuery,
      [order]: action.data,
      [`${action.order}ResultClass`]: action.resultClass,
      [`${action.order}Fetching`]: false,
      [`${action.order}ResultUpdateID`]: ++state[`${action.order}ResultUpdateID`]
    }
  } else {
    return {
      ...state,
      results: action.data,
      resultClass: action.resultClass,
      resultsSparqlQuery: action.sparqlQuery,
      fetching: false,
      resultUpdateID: ++state.resultUpdateID
    }
  }
}

export const updatePaginatedResults = (state, action) => {
  return {
    ...state,
    paginatedResults: action.data || [],
    paginatedResultsSparqlQuery: action.sparqlQuery,
    fetching: false
  }
}

export const fetchFacet = (state, action) => {
  return {
    ...state,
    facets: {
      ...state.facets,
      [action.facetID]: {
        ...state.facets[action.facetID],
        isFetching: true
      }
    }
  }
}

export const clearFacet = (state, action) => {
  return {
    ...state,
    updatedFacet: '', // force all facets to fetch new falues
    facetUpdateID: ++state.facetUpdateID,
    // updatedFilter: action.value, // a react sortable tree object, latlngbounds or text filter
    facets: {
      ...state.facets,
      [action.facetID]: {
        ...state.facets[action.facetID],
        uriFilter: null
      }
    }
  }
}

export const fetchFacetFailed = (state, action) => {
  return {
    ...state,
    facets: {
      ...state.facets,
      [action.facetID]: {
        ...state.facets[action.facetID],
        isFetching: false
      }
    },
    updatedFacet: ''
  }
}

export const updateFacetValues = (state, action) => {
  if (state.facets[action.id].facetType === 'timespan' ||
    state.facets[action.id].facetType === 'integer') {
    return {
      ...state,
      // with normal facets the 'facetUpdateID' is handled with the 'updateFacetFilter' function
      ...(action.type === UPDATE_FACET_VALUES_CONSTRAIN_SELF) && { facetUpdateID: ++state.facetUpdateID },
      facets: {
        ...state.facets,
        [action.id]: {
          ...state.facets[action.id],
          min: action.data.min || null,
          max: action.data.max || null,
          isFetching: false
        }
      }
    }
  } else {
    return {
      ...state,
      // with normal facets the 'facetUpdateID' is handled with the 'updateFacetFilter' function
      ...(action.type === UPDATE_FACET_VALUES_CONSTRAIN_SELF) && { facetUpdateID: ++state.facetUpdateID },
      facets: {
        ...state.facets,
        [action.id]: {
          ...state.facets[action.id],
          distinctValueCount: state.facets[action.id].type === 'hierarchical'
            ? action.flatData.length
            : action.data.length,
          values: action.data || [],
          flatValues: action.flatData || [],
          isFetching: false
        }
      }
    }
  }
}

export const updateHeaderExpanded = (state, action) => {
  if (action.pageType === 'instancePage') {
    return {
      ...state,
      instancePageHeaderExpanded: !state.instancePageHeaderExpanded
    }
  } else {
    return {
      ...state,
      facetedSearchHeaderExpanded: !state.facetedSearchHeaderExpanded
    }
  }
}

export const updateKnowledgeGraphMetadata = (state, action) => {
  return {
    ...state,
    knowledgeGraphMetadata: action.data,
    fetching: false
  }
}

export const updateMapBounds = (state, action) => {
  const { resultClass, bounds } = action
  return {
    ...state,
    maps: {
      ...state.maps,
      [resultClass]: {
        latMin: bounds.latMin,
        longMin: bounds.longMin,
        latMax: bounds.latMax,
        longMax: bounds.longMax,
        center: bounds.center,
        zoom: bounds.zoom
      }
    }
  }
}
