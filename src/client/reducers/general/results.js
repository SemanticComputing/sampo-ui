import {
  FETCH_RESULTS,
  FETCH_RESULT_COUNT,
  FETCH_RESULTS_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_BY_URI,
  FETCH_INSTANCE_ANALYSIS,
  UPDATE_RESULT_COUNT,
  UPDATE_RESULTS,
  UPDATE_PAGINATED_RESULTS,
  UPDATE_INSTANCE_TABLE,
  UPDATE_INSTANCE_TABLE_EXTERNAL,
  UPDATE_INSTANCE_ANALYSIS,
  UPDATE_PAGE,
  UPDATE_ROWS_PER_PAGE,
  SORT_RESULTS,
  UPDATE_PERSPECTIVE_HEADER_EXPANDED,
  UPDATE_KNOWLEDGE_GRAPH_METADATA
} from '../../actions'
import {
  fetchResults,
  fetchResultsFailed,
  fetchResultCount,
  fetchInstanceAnalysisData,
  updateSortBy,
  updateResultCount,
  updateResults,
  updatePaginatedResults,
  updateInstanceTableData,
  updateInstanceTableExternalData,
  updateInstanceAnalysisData,
  updatePage,
  updateRowsPerPage,
  updateHeaderExpanded,
  updateKnowledgeGraphMetadata
} from './helpers'

export const handleDataFetchingAction = (state, action) => {
  switch (action.type) {
    case FETCH_RESULTS:
    case FETCH_PAGINATED_RESULTS:
    case FETCH_BY_URI:
      return fetchResults(state)
    case FETCH_RESULT_COUNT:
      return fetchResultCount(state)
    case FETCH_INSTANCE_ANALYSIS:
      return fetchInstanceAnalysisData(state)
    case FETCH_RESULTS_FAILED:
    case FETCH_PAGINATED_RESULTS_FAILED:
      return fetchResultsFailed(state)
    case SORT_RESULTS:
      return updateSortBy(state, action)
    case UPDATE_RESULT_COUNT:
      return updateResultCount(state, action)
    case UPDATE_RESULTS:
      return updateResults(state, action)
    case UPDATE_PAGINATED_RESULTS:
      return updatePaginatedResults(state, action)
    case UPDATE_INSTANCE_TABLE:
      return updateInstanceTableData(state, action)
    case UPDATE_INSTANCE_TABLE_EXTERNAL:
      return updateInstanceTableExternalData(state, action)
    case UPDATE_INSTANCE_ANALYSIS:
      return updateInstanceAnalysisData(state, action)
    case UPDATE_PAGE:
      return updatePage(state, action)
    case UPDATE_ROWS_PER_PAGE:
      return updateRowsPerPage(state, action)
    case UPDATE_PERSPECTIVE_HEADER_EXPANDED:
      return updateHeaderExpanded(state, action)
    case UPDATE_KNOWLEDGE_GRAPH_METADATA:
      return updateKnowledgeGraphMetadata(state, action)
    default:
      return state
  }
}
