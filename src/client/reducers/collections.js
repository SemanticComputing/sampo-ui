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
  paginatedResults: [],
  resultCount: 0,
  resultsUpdateID: -1,
  instance: null,
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  sparqlQuery: null,
  tableColumns: [
    {
      id: 'prefLabel',
      label: 'Title',
      desc: 'The name or title of the Collection.',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'manuscript',
      label: 'Manuscript',
      desc: `
        The manuscript(s) that have been a part of the collection at some
        point in time.
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
    },
    {
      id: 'owner',
      label: 'Owner',
      desc: `
        Former or current owners (individual or institutional).
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250
    },
    {
      id: 'place',
      label: 'Place',
      desc: `
        Location of the collection at some point during its existence
      `,
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
    },
    {
      id: 'source',
      label: 'Source',
      desc: `
        The source database (Schoenberg, Bibale, and Bodleian) that the Collection
        occurs in. Currently one Collection has always only one dataset as a source.
      `,
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200
    },
  ]
};

const collections = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'collections') {
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

export default collections;
