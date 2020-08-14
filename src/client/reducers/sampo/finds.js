import {
  FETCH_RESULTS,
  FETCH_RESULT_COUNT,
  FETCH_RESULTS_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_BY_URI,
  UPDATE_RESULT_COUNT,
  UPDATE_RESULTS,
  UPDATE_PAGINATED_RESULTS,
  UPDATE_INSTANCE,
  UPDATE_PAGE,
  UPDATE_ROWS_PER_PAGE,
  SORT_RESULTS,
  UPDATE_PERSPECTIVE_HEADER_EXPANDED,
  UPDATE_URL
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
  results: null,
  resultUpdateID: 0,
  resultsSparqlQuery: null,
  paginatedResults: [],
  paginatedResultsSparqlQuery: null,
  instance: null,
  instanceSparqlQuery: null,
  resultCount: 0,
  page: -1,
  pagesize: 15,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  facetedSearchHeaderExpanded: false,
  instancePageHeaderExpanded: false,
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
      id: 'prefLabel',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 180
    },
    {
      id: 'specification',
      valueType: 'string',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 180
    },
    {
      id: 'type',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 180
    },
    {
      id: 'subCategory',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 180
    },
    {
      id: 'material',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 180
    },
    {
      id: 'period',
      valueType: 'string',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 180
    }
    // {
    //   id: 'startYear',
    //   valueType: 'string',
    //   makeLink: false,
    //   externalLink: false,
    //   sortValues: true,
    //   numberedList: false,
    //   minWidth: 180
    // },
    // {
    //   id: 'endYear',
    //   valueType: 'string',
    //   makeLink: false,
    //   externalLink: false,
    //   sortValues: true,
    //   numberedList: false,
    //   minWidth: 180
    // },
    // {
    //   id: 'earliestStart',
    //   valueType: 'string',
    //   makeLink: false,
    //   externalLink: false,
    //   sortValues: true,
    //   numberedList: false,
    //   minWidth: 180
    // },
    // {
    //   id: 'latestEnd',
    //   valueType: 'string',
    //   makeLink: false,
    //   externalLink: false,
    //   sortValues: true,
    //   numberedList: false,
    //   minWidth: 180
    // }
  ]
}

const resultClasses = new Set([
  'finds',
  'findsTimeline'
])

const finds = (state = INITIAL_STATE, action) => {
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
      case UPDATE_URL:
        return (state)
      default:
        return state
    }
  } else return state
}

export default finds
