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
} from './helpers';

export const INITIAL_STATE = {
  results: [],
  paginatedResults: [],
  resultCount: 0,
  resultsUpdateID: -1,
  instance: {},
  page: -1,
  pagesize: 10,
  sortBy: null,
  sortDirection: null,
  fetching: false,
  fetchingResultCount: false,
  tableColumns: [
    {
      id: 'prefLabel',
      label: 'Label',
      desc: 'Label description',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 150,
      priority: 1
    },
    {
      id: 'type',
      label: 'Type',
      desc: 'Type description',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: false,
      numberedList: false,
      minWidth: 150,
      priority: 8,
    },
    {
      id: 'birthPlace',
      label: 'Birth/formation place',
      desc: 'Birth place description',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
      priority: 6
    },
    {
      id: 'birthDateTimespan',
      label: 'Birth/formation year',
      desc: 'Birth/formation year description',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 220,
      priority: 3
    },
    {
      id: 'deathDateTimespan',
      label: 'Death/dissolution year',
      desc: 'Date of death/dissolution description',
      valueType: 'object',
      makeLink: false,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
      priority: 4
    },
    {
      id: 'place',
      label: 'Activity location',
      desc: 'Activity location',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 200,
      priority: 2
    },
    {
      id: 'work',
      label: 'Work',
      desc: 'Work description',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      priority: 5
    },
    {
      id: 'manuscript',
      label: 'Manuscript',
      desc: 'Manuscript',
      valueType: 'object',
      makeLink: true,
      externalLink: false,
      sortValues: true,
      numberedList: false,
      minWidth: 250,
      priority: 7
    },
    {
      id: 'source',
      label: 'Source',
      desc: 'Source description',
      valueType: 'object',
      makeLink: true,
      externalLink: true,
      sortValues: true,
      numberedList: false,
      priority: 9
    },

  ],
};

const actors = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'actors') {
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
      default:
        return state;
    }
  } else return state;
};

export default actors;
