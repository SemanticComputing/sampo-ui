export const FETCH_RESULTS = 'FETCH_RESULTS';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const SORT_RESULTS = 'SORT_RESULTS';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const FETCH_RESULTS_FAILED = 'FETCH_RESULTS_FAILED';

export const FETCH_BY_URI = 'FETCH_BY_URI';
export const UPDATE_INSTANCE = 'UPDATE_INSTANCE';
export const FETCH_BY_URI_FAILED = 'FETCH_BY_URI_FAILED';

export const FETCH_FACET = 'FETCH_FACET';
export const UPDATE_FACET = 'UPDATE_FACET';
export const FETCH_FACET_FAILED = 'FETCH_FACET_FAILED';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const OPEN_FACET_DIALOG = 'OPEN_FACET_DIALOG';
export const CLOSE_FACET_DIALOG = 'CLOSE_FACET_DIALOG';

export const OPEN_MARKER_POPUP = 'OPEN_MARKER_POPUP';

export const CLEAR_ERROR = 'CLEAR_ERROR';


export const fetchResults = (resultClass, facetClass, variant) => ({
  type: FETCH_RESULTS,
  resultClass, facetClass, variant
});
export const updateResults = ({ resultClass, data }) => ({
  type: UPDATE_RESULTS,
  resultClass, data
});
export const sortResults = sortBy => ({
  type: SORT_RESULTS,
  sortBy
});
export const updatePage = (resultClass, page) => ({
  type: UPDATE_PAGE,
  resultClass, page
});
export const fetchResultsFailed = error => ({
  type: FETCH_RESULTS_FAILED,
  error
});

export const fetchByURI = (resultClass, uri) => ({
  type: FETCH_BY_URI,
  resultClass, uri
});
export const updateInstance = ({ resultClass, instance }) => ({
  type: UPDATE_INSTANCE,
  resultClass, instance
});
export const fetchByURIFailed = error => ({
  type: FETCH_BY_URI_FAILED,
  error
});

export const fetchFacet = (resultClass, id, sortBy, sortDirection) => ({
  type: FETCH_FACET,
  resultClass, id, sortBy, sortDirection
});
export const fetchFacetFailed = error => ({
  type: FETCH_FACET_FAILED,
  error
});
export const updateFacet = ({ id, distinctValueCount, values, flatValues, sortBy, sortDirection }) => ({
  type: UPDATE_FACET,
  id, distinctValueCount, values, flatValues, sortBy, sortDirection
});
export const updateFilter = filter => ({
  type: UPDATE_FILTER,
  filter
});
export const openFacetDialog = property => ({
  type: OPEN_FACET_DIALOG,
  property
});
export const closeFacetDialog = () => ({
  type: CLOSE_FACET_DIALOG,
});

export const openMarkerPopup = uri => ({
  type: OPEN_MARKER_POPUP,
  uri
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});
