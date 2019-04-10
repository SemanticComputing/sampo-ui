import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_BY_URI,
  UPDATE_PAGINATED_RESULTS,
  UPDATE_RESULTS,
  UPDATE_INSTANCE,
  UPDATE_PAGE,
  SORT_RESULTS,
} from '../actions';
import {
  fetchResults,
  fetchResultsFailed,
  updateSortBy,
  updateResults,
  updatePaginatedResults,
  updateInstance,
  updatePage,
} from './helpers';

export const INITIAL_STATE = {
  results: [],
  paginatedResults: [],
  resultsCount: 0,
  resultsUpdateID: -1,
  instance: {},
  page: -1,
  pagesize: 5,
  sortBy: 'prefLabel',
  sortDirection: 'asc',
  fetching: false,
  tableColumns: [
    {
      id: 'prefLabel',
      label: 'Label',
      desc: 'Label description',
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false
    },
    {
      id: 'source',
      label: 'Source',
      desc: 'Source description',
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false
    },
  ],
};

const organizations = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'organizations') {
    switch (action.type) {
      case FETCH_RESULTS:
      case FETCH_PAGINATED_RESULTS:
      case FETCH_BY_URI:
        return fetchResults(state);
      case FETCH_RESULTS_FAILED:
      case FETCH_PAGINATED_RESULTS_FAILED:
        return fetchResultsFailed(state);
      case SORT_RESULTS:
        return updateSortBy(state, action);
      case UPDATE_RESULTS:
        return updateResults(state, action);
      case UPDATE_PAGINATED_RESULTS:
        return updatePaginatedResults(state, action);
      case UPDATE_INSTANCE:
        return updateInstance(state, action);
      case UPDATE_PAGE:
        return updatePage(state, action);
      default:
        return state;
    }
  } else return state;
};

export default organizations;
