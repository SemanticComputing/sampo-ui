export const FETCH_PAGINATED_RESULTS = 'FETCH_PAGINATED_RESULTS'
export const FETCH_PAGINATED_RESULTS_FAILED = 'FETCH_PAGINATED_RESULTS_FAILED'
export const FETCH_RESULTS = 'FETCH_RESULTS'
export const FETCH_RESULTS_FAILED = 'FETCH_RESULTS_FAILED'
export const FETCH_RESULT_COUNT = 'FETCH_RESULT_COUNT'
export const FETCH_RESULT_COUNT_FAILED = 'FETCH_RESULT_COUNT_FAILED'
export const FETCH_FULL_TEXT_RESULTS = 'FETCH_FULL_TEXT_RESULTS'
export const SORT_FULL_TEXT_RESULTS = 'SORT_FULL_TEXT_RESULTS'
export const UPDATE_RESULT_COUNT = 'UPDATE_RESULT_COUNT'
export const UPDATE_PAGINATED_RESULTS = 'UPDATE_PAGINATED_RESULTS'
export const UPDATE_RESULTS = 'UPDATE_RESULTS'
export const CLEAR_RESULTS = 'CLEAR_RESULTS'
export const SORT_RESULTS = 'SORT_RESULTS'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_ROWS_PER_PAGE = 'UPDATE_ROWS_PER_PAGE'
export const FETCH_BY_URI = 'FETCH_BY_URI'
export const FETCH_BY_URI_FAILED = 'FETCH_BY_URI_FAILED'
export const FETCH_SIMILAR_DOCUMENTS_BY_ID = 'FETCH_SIMILAR_DOCUMENTS_BY_ID'
export const FETCH_SIMILAR_DOCUMENTS_BY_ID_FAILED = 'FETCH_SIMILAR_DOCUMENTS_BY_ID_FAILED'
export const FETCH_NETWORK_BY_ID = 'FETCH_NETWORK_BY_ID'
export const FETCH_NETWORK_BY_ID_FAILED = 'FETCH_NETWORK_BY_ID_FAILED'
export const FETCH_INSTANCE_ANALYSIS = 'FETCH_INSTANCE_ANALYSIS'
export const FETCH_INSTANCE_ANALYSIS_FAILED = 'FETCH_INSTANCE_ANALYSIS_FAILED'
export const UPDATE_INSTANCE_TABLE = 'UPDATE_INSTANCE_TABLE'
export const UPDATE_INSTANCE_TABLE_EXTERNAL = 'UPDATE_INSTANCE_TABLE_EXTERNAL'
export const UPDATE_INSTANCE_ANALYSIS = 'UPDATE_INSTANCE_ANALYSIS'
export const FETCH_FACET = 'FETCH_FACET'
export const FETCH_FACET_CONSTRAIN_SELF = 'FETCH_FACET_CONSTRAIN_SELF'
export const FETCH_FACET_FAILED = 'FETCH_FACET_FAILED'
export const FETCH_FACET_CONSTRAIN_SELF_FAILED = 'FETCH_FACET_CONSTRAIN_SELF_FAILED'
export const CLEAR_FACET = 'CLEAR_FACET'
export const CLEAR_ALL_FACETS = 'CLEAR_ALL_FACETS'
export const UPDATE_FACET_VALUES = 'UPDATE_FACET_VALUES'
export const UPDATE_FACET_VALUES_CONSTRAIN_SELF = 'UPDATE_FACET_VALUES_CONSTRAIN_SELF'
export const UPDATE_FACET_OPTION = 'UPDATE_FACET_OPTION'
export const UPDATE_CLIENT_SIDE_FILTER = 'UPDATE_CLIENT_SIDE_FILTER'
export const UPDATE_MAP_BOUNDS = 'UPDATE_MAP_BOUNDS'
export const FETCH_GEOJSON_LAYERS = 'FETCH_GEOJSON_LAYERS'
export const FETCH_GEOJSON_LAYERS_BACKEND = 'FETCH_GEOJSON_LAYERS_BACKEND'
export const FETCH_GEOJSON_LAYERS_FAILED = 'FETCH_GEOJSON_LAYERS_FAILED'
export const CLEAR_GEOJSON_LAYERS = 'CLEAR_GEOJSON_LAYERS'
export const UPDATE_GEOJSON_LAYERS = 'UPDATE_GEOJSON_LAYERS'
export const OPEN_MARKER_POPUP = 'OPEN_MARKER_POPUP'
export const SHOW_ERROR = 'SHOW_ERROR'
export const UPDATE_PERSPECTIVE_HEADER_EXPANDED = 'UPDATE_PERSPECTIVE_HEADER_EXPANDED'
export const UPDATE_URL = 'UPDATE_URL'
export const LOAD_LOCALES = 'LOAD_LOCALES'
export const LOAD_LOCALES_FAILED = 'LOAD_LOCALES_FAILED'
export const UPDATE_LOCALE = 'UPDATE_LOCALE'
export const ANIMATE_MAP = 'ANIMATE_MAP'
export const CLIENT_FS_UPDATE_QUERY = 'CLIENT_FS_UPDATE_QUERY'
export const CLIENT_FS_TOGGLE_DATASET = 'CLIENT_FS_TOGGLE_DATASET'
export const CLIENT_FS_FETCH_RESULTS = 'CLIENT_FS_FETCH_RESULTS'
export const CLIENT_FS_FETCH_RESULTS_FAILED = 'CLIENT_FS_FETCH_RESULTS_FAILED'
export const CLIENT_FS_UPDATE_RESULTS = 'CLIENT_FS_UPDATE_RESULTS'
export const CLIENT_FS_CLEAR_RESULTS = 'CLIENT_FS_CLEAR_RESULTS'
export const CLIENT_FS_UPDATE_FACET = 'CLIENT_FS_UPDATE_FACET'
export const CLIENT_FS_SORT_RESULTS = 'CLIENT_FS_SORT_RESULTS'
export const FETCH_KNOWLEDGE_GRAPH_METADATA = 'FETCH_KNOWLEDGE_GRAPH_METADATA'
export const FETCH_KNOWLEDGE_GRAPH_METADATA_FAILED = 'FETCH_KNOWLEDGE_GRAPH_METADATA_FAILED'
export const UPDATE_KNOWLEDGE_GRAPH_METADATA = 'UPDATE_KNOWLEDGE_GRAPH_METADATA'

export const fetchPaginatedResults = (resultClass, facetClass, sortBy) => ({
  type: FETCH_PAGINATED_RESULTS,
  resultClass,
  facetClass,
  sortBy
})
export const fetchPaginatedResultsFailed = (resultClass, error, message) => ({
  type: FETCH_PAGINATED_RESULTS_FAILED,
  resultClass,
  error,
  message
})
export const fetchResults = ({
  perspectiveID,
  resultClass,
  facetClass,
  uri = null,
  limit = null,
  optimize = null,
  reason = null
}) => ({
  type: FETCH_RESULTS,
  perspectiveID,
  resultClass,
  facetClass,
  uri,
  limit,
  optimize,
  reason
})
export const fetchInstanceAnalysis = ({
  resultClass,
  facetClass,
  uri = null,
  fromID = null,
  toID = null,
  period = null,
  province = null
}) => ({
  type: FETCH_INSTANCE_ANALYSIS,
  resultClass,
  facetClass,
  uri,
  fromID,
  toID,
  period,
  province
})
export const fetchResultCount = ({ resultClass, facetClass }) => ({
  type: FETCH_RESULT_COUNT,
  resultClass,
  facetClass
})
export const fetchResultCountFailed = (resultClass, error, message) => ({
  type: FETCH_RESULT_COUNT_FAILED,
  resultClass,
  error,
  message
})
export const fetchFullTextResults = ({ resultClass, query }) => ({
  type: FETCH_FULL_TEXT_RESULTS,
  resultClass,
  query
})
export const sortFullTextResults = ({ resultClass, sortBy }) => ({
  type: SORT_FULL_TEXT_RESULTS,
  resultClass,
  sortBy
})
export const fetchResultsFailed = (resultClass, error, message) => ({
  type: FETCH_RESULTS_FAILED,
  resultClass,
  error,
  message
})
export const updateResultCount = ({ resultClass, data, sparqlQuery }) => ({
  type: UPDATE_RESULT_COUNT,
  resultClass,
  data,
  sparqlQuery
})
export const updatePaginatedResults = ({ resultClass, page, pagesize, data, sparqlQuery }) => ({
  type: UPDATE_PAGINATED_RESULTS,
  resultClass,
  page,
  pagesize,
  data,
  sparqlQuery
})
export const updateResults = ({ resultClass, data, sparqlQuery, query, jenaIndex }) => ({
  type: UPDATE_RESULTS,
  resultClass,
  data,
  sparqlQuery,
  query,
  jenaIndex
})
export const sortResults = (resultClass, sortBy) => ({
  type: SORT_RESULTS,
  resultClass,
  sortBy
})
export const clearResults = ({ resultClass }) => ({
  type: CLEAR_RESULTS,
  resultClass
})
export const updatePage = (resultClass, page) => ({
  type: UPDATE_PAGE,
  resultClass,
  page
})
export const updateRowsPerPage = (resultClass, rowsPerPage) => ({
  type: UPDATE_ROWS_PER_PAGE,
  resultClass,
  rowsPerPage
})
export const fetchByURI = ({ perspectiveID, resultClass, facetClass, uri }) => ({
  type: FETCH_BY_URI,
  perspectiveID,
  resultClass,
  facetClass,
  uri
})
export const fetchByURIFailed = (resultClass, error, message) => ({
  type: FETCH_RESULTS_FAILED,
  resultClass,
  error,
  message
})
export const fetchSimilarDocumentsById = ({ resultClass, id, modelName, resultSize }) => ({
  type: FETCH_SIMILAR_DOCUMENTS_BY_ID,
  resultClass,
  id,
  modelName,
  resultSize
})
export const fetchSimilarDocumentsByIdFailed = (resultClass, id, error, message) => ({
  type: FETCH_SIMILAR_DOCUMENTS_BY_ID_FAILED,
  resultClass,
  id,
  error,
  message
})
export const updateInstanceTable = ({ resultClass, data, sparqlQuery }) => ({
  type: UPDATE_INSTANCE_TABLE,
  resultClass,
  data,
  sparqlQuery
})
export const updateInstanceTableExternal = ({ resultClass, data }) => ({
  type: UPDATE_INSTANCE_TABLE_EXTERNAL,
  resultClass,
  data
})
export const updateInstanceAnalysisData = ({ resultClass, data, sparqlQuery }) => ({
  type: UPDATE_INSTANCE_ANALYSIS,
  resultClass,
  data
})
export const fetchFacet = ({ facetClass, facetID, constrainSelf = false }) => ({
  type: FETCH_FACET,
  facetClass,
  facetID,
  constrainSelf
})
export const clearFacet = ({ facetClass, facetID }) => ({
  type: CLEAR_FACET,
  facetClass,
  facetID
})
export const clearAllFacets = ({ facetClass }) => ({
  type: CLEAR_ALL_FACETS,
  facetClass
})
export const fetchFacetFailed = (facetClass, id, error, message) => ({
  type: FETCH_FACET_FAILED,
  facetClass,
  id,
  error,
  message
})
export const fetchFacetConstrainSelfFailed = (facetClass, id, error, message) => ({
  type: FETCH_FACET_CONSTRAIN_SELF_FAILED,
  facetClass,
  id,
  error,
  message
})
export const fetchFacetConstrainSelf = ({ facetClass, facetID }) => ({
  type: FETCH_FACET_CONSTRAIN_SELF,
  facetClass,
  facetID
})
export const updateFacetValues = ({
  facetClass,
  id,
  data,
  flatData,
  sparqlQuery
}) => ({
  type: UPDATE_FACET_VALUES,
  facetClass,
  id,
  data,
  flatData,
  sparqlQuery
})
export const updateFacetValuesConstrainSelf = ({
  facetClass,
  id,
  data,
  flatData,
  sparqlQuery
}) => ({
  type: UPDATE_FACET_VALUES_CONSTRAIN_SELF,
  facetClass,
  id,
  data,
  flatData,
  sparqlQuery
})
export const updateFacetOption = ({ facetClass, facetID, option, value }) => ({
  type: UPDATE_FACET_OPTION,
  facetClass,
  facetID,
  option,
  value
})
export const updateClientSideFilter = filterObj => ({
  type: UPDATE_CLIENT_SIDE_FILTER,
  filterObj
})
export const openMarkerPopup = uri => ({
  type: OPEN_MARKER_POPUP,
  uri
})
export const showError = message => ({
  type: SHOW_ERROR,
  message
})
export const updatePerspectiveHeaderExpanded = ({ resultClass, pageType }) => ({
  type: UPDATE_PERSPECTIVE_HEADER_EXPANDED,
  resultClass,
  pageType
})
export const loadLocales = currentLanguage => ({
  type: LOAD_LOCALES,
  currentLanguage
})
export const loadLocalesFailed = (currentLanguage, error, message) => ({
  type: LOAD_LOCALES_FAILED,
  currentLanguage,
  error,
  message
})
export const updateLocale = ({ language }) => ({
  type: UPDATE_LOCALE,
  language
})
export const animateMap = value => ({
  type: ANIMATE_MAP,
  value
})
export const updateMapBounds = ({ resultClass, bounds }) => ({
  type: UPDATE_MAP_BOUNDS,
  resultClass,
  bounds
})
export const fetchGeoJSONLayers = ({ layerIDs, bounds }) => ({
  type: FETCH_GEOJSON_LAYERS,
  layerIDs,
  bounds
})
export const clearGeoJSONLayers = () => ({
  type: CLEAR_GEOJSON_LAYERS
})
export const fetchGeoJSONLayersBackend = ({ layerIDs, bounds }) => ({
  type: FETCH_GEOJSON_LAYERS_BACKEND,
  layerIDs,
  bounds
})
export const updateGeoJSONLayers = ({ payload }) => ({
  type: UPDATE_GEOJSON_LAYERS,
  payload
})
export const fetchGeoJSONLayersFailed = ({ error, message }) => ({
  type: FETCH_GEOJSON_LAYERS_FAILED,
  error,
  message
})
export const clientFSUpdateQuery = query => ({
  type: CLIENT_FS_UPDATE_QUERY,
  query
})
export const clientFSToggleDataset = dataset => ({
  type: CLIENT_FS_TOGGLE_DATASET,
  dataset
})

export const clientFSFetchResults = ({ jenaIndex, query }) => ({
  type: CLIENT_FS_FETCH_RESULTS,
  jenaIndex,
  query
})
export const clientFSFetchResultsFailed = error => ({
  type: CLIENT_FS_FETCH_RESULTS_FAILED,
  error
})
export const clientFSUpdateResults = ({ results, jenaIndex }) => ({
  type: CLIENT_FS_UPDATE_RESULTS,
  results,
  jenaIndex
})
export const clientFSClearResults = () => ({
  type: CLIENT_FS_CLEAR_RESULTS
})
export const clientFSUpdateFacet = ({ facetID, value, latestValues }) => ({
  type: CLIENT_FS_UPDATE_FACET,
  facetID,
  value,
  latestValues
})
export const clientFSSortResults = options => ({
  type: CLIENT_FS_SORT_RESULTS,
  options
})
export const fetchKnowledgeGraphMetadata = ({ resultClass }) => ({
  type: FETCH_KNOWLEDGE_GRAPH_METADATA,
  resultClass
})
export const fetchKnowledgeGraphMetadataFailded = (resultClass, error, message) => ({
  type: FETCH_KNOWLEDGE_GRAPH_METADATA_FAILED,
  resultClass,
  error,
  message
})
export const updateKnowledgeGraphMetadata = ({ resultClass, data, sparqlQuery }) => ({
  type: UPDATE_KNOWLEDGE_GRAPH_METADATA,
  resultClass,
  data,
  sparqlQuery
})
