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
} from '../actions';
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
} from './helpers';

export const INITIAL_STATE = {
  results: [],
  resultsSparqlQuery: null,
  paginatedResults: [],
  paginatedResultsSparqlQuery: null,
  instance: null,
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
  tableColumns: [
    {
      id: 'type',
      label: 'Type',
      desc: `
        Distinguish between “Transfer of Custody”, “Production”, and other
        types of “Activity” events.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'manuscript',
      label: 'Manuscript / Collection',
      desc: `
        The manuscript or manuscript collection associated with the event.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: false,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'eventTimespan',
      label: 'Date',
      desc: `
        The date or time period associated with the event.
      `,
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'place',
      label: 'Place',
      desc: 'The specific place associated with the event.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'surrender',
      label: 'Custody surrendered by',
      desc: 'Custody surrendered by',
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
      label: 'Custody received by',
      desc: 'Custody received by',
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
      label: 'Observed owner',
      desc: 'Observed owner',
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
      id: 'source',
      label: 'Source',
      desc: `
        The source database (Schoenberg, Bibale, and Bodleian) that provided
        the information about the event.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
  ],
};

const events = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'events') {
    switch (action.type) {
      case FETCH_RESULTS:
      case FETCH_PAGINATED_RESULTS:
      case FETCH_BY_URI:
        return fetchResults(state);
      case FETCH_RESULT_COUNT:
        return fetchResultCount(state);
      case FETCH_RESULTS_FAILED:
      case FETCH_PAGINATED_RESULTS_FAILED:
        return fetchResultsFailed(state);
      case SORT_RESULTS:
        return updateSortBy(state, action);
      case UPDATE_RESULT_COUNT:
        return updateResultCount(state, action);
      case UPDATE_RESULTS:
        return updateResults(state, action);
      case UPDATE_PAGINATED_RESULTS:
        return updatePaginatedResults(state, action);
      case UPDATE_INSTANCE:
        return updateInstance(state, action);
      case UPDATE_PAGE:
        return updatePage(state, action);
      case UPDATE_ROWS_PER_PAGE:
        return updateRowsPerPage(state, action);
      case UPDATE_PERSPECTIVE_HEADER_EXPANDED:
        return updateHeaderExpanded(state, action);
      default:
        return state;
    }
  } else return state;
};

export default events;
