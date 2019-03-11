export const fetchResults = state => {
  return {
    ...state,
    fetching: true
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
    instance: action.instance,
    fetching: false
  };
};

export const updatePage = (state, action) => {
  return {
    ...state,
    page: action.page
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

export const updateFilter = (state, action) => {
  const { property, value } = action;
  let valueSet = state.filters[property];
  if (valueSet.has(value)) {
    valueSet.delete(value);
  } else {
    valueSet.add(value);
  }
  const newFacetFilters = {
    ...state.filters,
    [ property ] : valueSet
  };
  return {
    ...state,
    filters: newFacetFilters,
    updatedFacet: property,
    facetUpdateID: ++state.facetUpdateID
  };
};

export const updateSpatialFilter = (state, action) => {
  console.log(action)
  const { property, filter } = action;
  const newFacetFilters = {
    ...state.spatialFilters,
    [ property ] : filter
  };
  return {
    ...state,
    spatialFilters: newFacetFilters,
    updatedFacet: property,
    facetUpdateID: ++state.facetUpdateID
  };
};

export const updateResults = (state, action) => {
  return {
    ...state,
    resultsUpdateID: ++state.resultsUpdateID,
    resultsCount: parseInt(action.data.resultCount),
    results: action.data.results,
    fetching: false,
  };
};

export const updatePaginatedResults = (state, action) => {
  return {
    ...state,
    resultsUpdateID: ++state.resultsUpdateID,
    resultsCount: parseInt(action.data.resultCount),
    paginatedResults: action.data.results,
    fetching: false
  };
};

export const fetchFacet = (state, action) => {
  return {
    ...state,
    facets: {
      ...state.facets,
      [ action.id ]: {
        ...state.facets[action.id],
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
      [ action.id ]: {
        ...state.facets[action.id],
        isFetching: false,
      }
    },
    filters: {
      productionPlace: new Set(),
      author: new Set(),
      source: new Set(),
      language: new Set(),
    },
    updatedFacet: '',
  };
};

export const updateFacet = (state, action) => {
  return {
    ...state,
    facets: {
      ...state.facets,
      [ action.id ]: {
        ...state.facets[action.id],
        distinctValueCount: action.distinctValueCount,
        values: action.values,
        flatValues: action.flatValues || [],
        sortBy: action.sortBy,
        sortDirection: action.sortDirection,
        isFetching: false
      }
    }
  };
};
