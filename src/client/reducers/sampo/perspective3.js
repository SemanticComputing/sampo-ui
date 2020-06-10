import {
  FETCH_RESULTS,
  FETCH_RESULT_COUNT,
  FETCH_RESULTS_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_BY_URI,
  UPDATE_RESULT_COUNT,
  UPDATE_PAGINATED_RESULTS,
  UPDATE_RESULTS,
  UPDATE_INSTANCE,
  UPDATE_PAGE,
  UPDATE_ROWS_PER_PAGE,
  SORT_RESULTS,
  UPDATE_PERSPECTIVE_HEADER_EXPANDED
} from '../../actions'
import {
  fetchResults,
  fetchResultsFailed,
  fetchResultCount,
  updateSortBy,
  updateResultCount,
  updateResults,
  updatePaginatedResults,
  updateInstance,
  updatePage,
  updateRowsPerPage,
  updateHeaderExpanded
} from '../helpers'

export const INITIAL_STATE = {
  results: [],
  resultUpdateID: 0,
  resultsSparqlQuery: null,
  paginatedResults: [],
  paginatedResultsSparqlQuery: null,
  instance: null,
  instanceNetworkData: null,
  instanceSparqlQuery: null,
  resultCount: 0,
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  sparqlQuery: null,
  facetedSearchHeaderExpanded: true,
  instancePageHeaderExpanded: true,
  properties: [
    {
      id: 'uri',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      onlyOnInstancePage: true
    },
    {
      id: 'type',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'manuscript',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'eventTimespan',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
    {
      id: 'place',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'surrender',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true,
      onlyForClass: 'http://erlangen-crm.org/current/E10_Transfer_of_Custody'
    },
    {
      id: 'receiver',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true,
      onlyForClass: 'http://erlangen-crm.org/current/E10_Transfer_of_Custody'
    },
    {
      id: 'observedOwner',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      onlyOnInstancePage: true,
      onlyForClass: 'http://erlangen-crm.org/current/E7_Activity'
    },
    {
      id: 'note',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      collapsedMaxWords: 12,
      onlyOnInstancePage: true
    },
    {
      id: 'source',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    }
  ]
}

const resultClasses = new Set([
  'perspective3'
])

const perspective3 = (state = INITIAL_STATE, action) => {
  if (resultClasses.has(action.resultClass)) {
    switch (action.type) {
      case FETCH_RESULTS:
      case FETCH_PAGINATED_RESULTS:
      case FETCH_BY_URI:
        return fetchResults(state)
      case FETCH_RESULT_COUNT:
        return fetchResultCount(state)
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
      case UPDATE_INSTANCE:
        return updateInstance(state, action)
      case UPDATE_PAGE:
        return updatePage(state, action)
      case UPDATE_ROWS_PER_PAGE:
        return updateRowsPerPage(state, action)
      case UPDATE_PERSPECTIVE_HEADER_EXPANDED:
        return updateHeaderExpanded(state, action)
      default:
        return state
    }
  } else return state
}

export default perspective3
