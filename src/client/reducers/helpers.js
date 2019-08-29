import { has, isEmpty } from 'lodash';

export const fetchResults = state => {
  return {
    ...state,
    // results: [],
    fetching: true,
    instance: null
  };
};

export const fetchResultCount = state => {
  return {
    ...state,
    fetchingResultCount: true
  };
};

export const fetchResultsFailed = state => {
  return {
    ...state,
    fetching: false
  };
};

export const updateInstance = (state, action) => {
  return {
    ...state,
    instance: action.data.length == 1 ? action.data[0] : {},
    sparqlQuery: action.sparqlQuery,
    fetching: false
  };
};

export const updatePage = (state, action) => {
  if (isNaN(action.page)) {
    return state;
  } else {
    return {
      ...state,
      page: action.page
    };
  }
};

export const updateRowsPerPage = (state, action) => {
  return {
    ...state,
    pagesize: action.rowsPerPage
  };
};


export const updateSortBy = (state, action) => {
  if (state.sortBy === action.sortBy) {
    return {
      ...state,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
    };
  } else {
    return {
      ...state,
      sortBy: action.sortBy,
      sortDirection: 'asc'
    };
  }
};

export const updateFacetOption = (state, action) => {
  const { facetID, option, value } = action;
  const filterTypes = [
    'uriFilter',
    'spatialFilter',
    'textFilter',
    'timespanFilter',
    'integerFilter'
  ];
  if (filterTypes.includes(action.option)) {
    return updateFacetFilter(state, action);
  } else {
    return {
      ...state,
      facets: {
        ...state.facets,
        [ facetID ]: {
          ...state.facets[facetID],
          [ option ]: value
        }
      }
    };
  }
};

const updateFacetFilter = (state, action) => {
  const { facetID, value } = action;
  const oldFacet = state.facets[facetID];
  let newFacet = {};
  if (oldFacet.filterType === 'uriFilter') {
    let newUriFilter = oldFacet.uriFilter == null ? {} : oldFacet.uriFilter;
    // 'value' is a react sortable tree object
    if (has(newUriFilter, value.node.id)) {
      value.added = false;
      delete newUriFilter[value.node.id];
      if (isEmpty(newUriFilter)) {
        newUriFilter = null;
      }
    } else {
      value.added = true;
      newUriFilter[value.node.id] = value;
    }
    newFacet = {
      ...state.facets[facetID],
      uriFilter: newUriFilter
    };
  } else if (oldFacet.filterType === 'spatialFilter') {
    newFacet = {
      ...state.facets[facetID],
      spatialFilter: value
    };
  } else if (oldFacet.filterType === 'textFilter') {
    newFacet = {
      ...state.facets[facetID],
      textFilter: value
    };
  } else if (oldFacet.filterType === 'timespanFilter') {
    if (value == null) {
      newFacet = {
        ...state.facets[facetID],
        timespanFilter: null
      };
    } else {
      newFacet = {
        ...state.facets[facetID],
        timespanFilter: {
          start: value[0],
          end: value[1]
        }
      };
    }
  } else if (oldFacet.filterType === 'integerFilter') {
    if (value == null) {
      newFacet = {
        ...state.facets[facetID],
        integerFilter: null
      };
    } else {
      newFacet = {
        ...state.facets[facetID],
        integerFilter: {
          start: value[0],
          end: value[1]
        }
      };
    }
  }
  return {
    ...state,
    updatedFacet: facetID,
    facetUpdateID: ++state.facetUpdateID,
    updatedFilter: value, // a react sortable tree object, latlngbounds or text filter
    facets: {
      ...state.facets,
      [ facetID ]: newFacet
    }
  };
};

export const updateResultCount = (state, action) => {
  return {
    ...state,
    resultCount: parseInt(action.data),
    fetchingResultCount: false,
  };
};

export const updateResults = (state, action) => {
  return {
    ...state,
    results: action.data,
    fetching: false,
  };
};

export const updatePaginatedResults = (state, action) => {
  return {
    ...state,
    paginatedResults: action.data || [],
    sparqlQuery: action.sparqlQuery,
    fetching: false
  };
};

export const fetchFacet = (state, action) => {
  return {
    ...state,
    facets: {
      ...state.facets,
      [ action.facetID ]: {
        ...state.facets[action.facetID],
        isFetching: true
      }
    }
  };
};

export const fetchFacetFailed = (state, action) => {
  return {
    ...state,
    facets: {
      ...state.facets,
      [ action.facetID ]: {
        ...state.facets[action.facetID],
        isFetching: false,
      }
    },
    updatedFacet: '',
  };
};

export const updateFacetValues = (state, action) => {
  if (state.facets[action.id].type === 'timespan'
    || state.facets[action.id].type === 'integer' ) {
    return {
      ...state,
      facets: {
        ...state.facets,
        [ action.id ]: {
          ...state.facets[action.id],
          min: action.data.min || null,
          max: action.data.max || null,
          isFetching: false
        }
      }
    };
  } else {
    return {
      ...state,
      facets: {
        ...state.facets,
        [ action.id ]: {
          ...state.facets[action.id],
          distinctValueCount: action.data.length || 0,
          values: action.data || [],
          flatValues: action.flatData || [],
          isFetching: false
        }
      }
    };
  }
};

export const updateHeaderExpanded = state => {
  return {
    ...state,
    headerExpanded: !state.headerExpanded
  };
};
