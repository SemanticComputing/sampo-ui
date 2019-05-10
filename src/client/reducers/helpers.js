import { has, isEmpty } from 'lodash';

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
  const { facetID, option, value } = action;
  const filterTypes = [ 'uriFilter', 'spatialFilter', 'textFilter' ];
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
    resultCount: parseInt(action.count),
    fetching: false,
  };
};

export const updateResults = (state, action) => {
  return {
    ...state,
    resultsUpdateID: ++state.resultsUpdateID,
    results: action.data.results,
    fetching: false,
  };
};

export const updatePaginatedResults = (state, action) => {
  return {
    ...state,
    resultsUpdateID: ++state.resultsUpdateID,
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
