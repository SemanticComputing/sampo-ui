export const FETCH_PAGINATED_RESULTS = 'FETCH_PAGINATED_RESULTS';
export const FETCH_PAGINATED_RESULTS_FAILED = 'FETCH_PAGINATED_RESULTS_FAILED';
export const FETCH_RESULTS = 'FETCH_RESULTS';
export const FETCH_RESULTS_FAILED = 'FETCH_RESULTS_FAILED';
export const FETCH_RESULT_COUNT = 'FETCH_RESULT_COUNT';
export const FETCH_RESULT_COUNT_FAILED = 'FETCH_RESULT_COUNT_FAILED';
export const FETCH_RESULTS_CLIENT_SIDE = 'FETCH_RESULTS_CLIENT_SIDE';
export const UPDATE_RESULT_COUNT = 'UPDATE_RESULT_COUNT';
export const UPDATE_PAGINATED_RESULTS = 'UPDATE_PAGINATED_RESULTS';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const SORT_RESULTS = 'SORT_RESULTS';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_ROWS_PER_PAGE = 'UPDATE_ROWS_PER_PAGE';
export const FETCH_BY_URI = 'FETCH_BY_URI';
export const FETCH_BY_URI_FAILED = 'FETCH_BY_URI_FAILED';
export const UPDATE_INSTANCE = 'UPDATE_INSTANCE';
export const FETCH_FACET = 'FETCH_FACET';
export const FETCH_FACET_FAILED = 'FETCH_FACET_FAILED';
export const UPDATE_FACET_VALUES = 'UPDATE_FACET_VALUES';
export const UPDATE_FACET_OPTION = 'UPDATE_FACET_OPTION';
export const UPDATE_CLIENT_SIDE_FILTER = 'UPDATE_CLIENT_SIDE_FILTER';
export const OPEN_MARKER_POPUP = 'OPEN_MARKER_POPUP';
export const SHOW_ERROR = 'SHOW_ERROR';
export const UPDATE_PERSPECTIVE_HEADER_EXPANDED = 'UPDATE_PERSPECTIVE_HEADER_EXPANDED';
export const UPDATE_URL = 'UPDATE_URL';

export const fetchPaginatedResults = (resultClass, facetClass, sortBy) => ({
  type: FETCH_PAGINATED_RESULTS,
  resultClass, facetClass, sortBy
});
export const fetchPaginatedResultsFailed = (resultClass, error, message) => ({
  type: FETCH_PAGINATED_RESULTS_FAILED,
  resultClass, error, message
});
export const fetchResults = ({ resultClass, facetClass, sortBy }) => ({
  type: FETCH_RESULTS,
  resultClass, facetClass, sortBy
});
export const fetchResultCount = ({ resultClass, facetClass }) => ({
  type: FETCH_RESULT_COUNT,
  resultClass, facetClass
});
export const fetchResultCountFailed = (resultClass, error, message) => ({
  type: FETCH_RESULT_COUNT_FAILED,
  resultClass, error, message
});
export const fetchResultsClientSide = ({ resultClass, jenaIndex, query }) => ({
  type: FETCH_RESULTS_CLIENT_SIDE,
  resultClass, jenaIndex, query
});
export const fetchResultsFailed = (resultClass, error, message) => ({
  type: FETCH_RESULTS_FAILED,
  resultClass, error, message
});
export const updateResultCount = ({ resultClass, data, sparqlQuery }) => ({
  type: UPDATE_RESULT_COUNT,
  resultClass, data, sparqlQuery
});
export const updatePaginatedResults = ({ resultClass, page, pagesize, data, sparqlQuery }) => ({
  type: UPDATE_PAGINATED_RESULTS,
  resultClass, page, pagesize, data, sparqlQuery
});
export const updateResults = ({ resultClass, data, sparqlQuery, query, jenaIndex }) => ({
  type: UPDATE_RESULTS,
  resultClass, data, sparqlQuery, query, jenaIndex
});
export const sortResults = (resultClass, sortBy) => ({
  type: SORT_RESULTS,
  resultClass, sortBy
});
export const clearResults = resultClass => ({
  type: CLEAR_RESULTS,
  resultClass
});
export const updatePage = (resultClass, page) => ({
  type: UPDATE_PAGE,
  resultClass, page
});
export const updateRowsPerPage = (resultClass, rowsPerPage) => ({
  type: UPDATE_ROWS_PER_PAGE,
  resultClass, rowsPerPage
});
export const fetchByURI = ({ resultClass, facetClass, uri }) => ({
  type: FETCH_BY_URI,
  resultClass, facetClass, uri
});
export const fetchByURIFailed = (resultClass, error, message) => ({
  type: FETCH_RESULTS_FAILED,
  resultClass, error, message
});
export const updateInstance = ({ resultClass, data, sparqlQuery }) => ({
  type: UPDATE_INSTANCE,
  resultClass, data, sparqlQuery
});
export const fetchFacet = ({ facetClass, facetID }) => ({
  type: FETCH_FACET,
  facetClass, facetID
});
export const fetchFacetFailed = (facetClass, id, error, message) => ({
  type: FETCH_FACET_FAILED,
  facetClass, id, error, message
});
export const updateFacetValues = ({
  facetClass,
  id,
  data,
  flatData,
  sparqlQuery
}) => ({
  type: UPDATE_FACET_VALUES,
  facetClass, id, data, flatData, sparqlQuery
});
export const updateFacetOption = ({ facetClass, facetID, option, value }) => ({
  type: UPDATE_FACET_OPTION,
  facetClass, facetID, option, value
});
export const updateClientSideFilter = filterObj => ({
  type: UPDATE_CLIENT_SIDE_FILTER,
  filterObj
});
export const openMarkerPopup = uri => ({
  type: OPEN_MARKER_POPUP,
  uri
});
export const showError = message => ({
  type: SHOW_ERROR,
  message
});
export const updatePerspectiveHeaderExpanded = ({ resultClass, pageType }) => ({
  type: UPDATE_PERSPECTIVE_HEADER_EXPANDED,
  resultClass, pageType
});
// export const updateURL = ({ resultClass = 'manuscripts', newURL }) => ({
//   type: UPDATE_URL,
//   resultClass, newURL
// });
