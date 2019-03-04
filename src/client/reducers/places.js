import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILED,
  FETCH_PAGINATED_RESULTS,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_BY_URI,
  UPDATE_RESULTS,
  UPDATE_INSTANCE,
  UPDATE_PAGE,
  SORT_RESULTS,
} from '../actions';
import { updateSortBy } from './helpers';

export const INITIAL_STATE = {
  resultCount: 0,
  results: [],
  instance: {},
  page: -1,
  pagesize: 5,
  sortBy: 'prefLabel',
  sortDirection: 'asc',
  fetching: false,
  tableColumns: [
    {
      id: 'prefLabel',
      valueType: 'string',
      makeLink: false,
      sortValues: true,
      numberedList: false
    },
    {
      id: 'placeType',
      valueType: 'string',
      makeLink: false,
      sortValues: true,
      numberedList: false
    },
    {
      id: 'parent',
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 170
    },
    {
      id: 'source',
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false
    },
  ],
};

const places = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'places') {
    switch (action.type) {
      case FETCH_RESULTS:
      case FETCH_PAGINATED_RESULTS:
        return { ...state, fetching: true };
      case FETCH_RESULTS_FAILED:
      case FETCH_PAGINATED_RESULTS_FAILED:
        return { ...state, fetching: false };
      case FETCH_BY_URI:
        return { ...state, fetching: true };
      case SORT_RESULTS:
        return updateSortBy(state, action);
      case UPDATE_RESULTS:
        return {
          ...state,
          resultCount: parseInt(action.data.resultCount),
          results: action.data.results,
          fetching: false
        };
      case UPDATE_INSTANCE:
        return {
          ...state,
          instance: action.instance,
          fetching: false
        };
      case UPDATE_PAGE:
        return {
          ...state,
          page: action.page
        };
      default:
        return state;
    }
  } else return state;
};

export default places;
