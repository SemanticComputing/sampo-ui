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

export const updateFacetOption = (state, action) => {
  if (action.option === 'uriFilter' || action.option === 'spatialFilter') {
    return updateFacetFilter(state, action);
  }
};

const updateFacetFilter = (state, action) => {
  const { facetID, value } = action;
  const oldFacet = state.facets[facetID];
  let newFacet = {};
  if (oldFacet.filterType === 'uriFilter') {
    let newUriFilter = oldFacet.uriFilter;
    if (newUriFilter.has(value)) {
      newUriFilter.delete(value);
    } else {
      newUriFilter.add(value);
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
  }
  return {
    ...state,
    updatedFacet: facetID,
    facetUpdateID: ++state.facetUpdateID,
    facets: {
      ...state.facets,
      [ facetID ]: newFacet
    }
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
    filters: {
      productionPlace: new Set(),
      author: new Set(),
      source: new Set(),
      language: new Set(),
    },
    updatedFacet: '',
  };
};

export const updateFacetValues = (state, action) => {
  return {
    ...state,
    facets: {
      ...state.facets,
      [ action.id ]: {
        ...state.facets[action.id],
        distinctValueCount: action.distinctValueCount,
        values: action.values,
        flatValues: action.flatValues || [],
        isFetching: false
      }
    }
  };
};
