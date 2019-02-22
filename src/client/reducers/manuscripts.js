import {
  FETCH_PAGINATED_RESULTS,
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
      id: 'source',
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false
    },
    {
      id: 'prefLabel',
      valueType: 'string',
      makeLink: false,
      sortValues: true,
      numberedList: false
    },
    {
      id: 'author',
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 170
    },
    {
      id: 'productionPlace',
      valueType: 'object',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 170,
    },
    {
      id: 'timespan',
      valueType: 'object',
      makeLink: false,
      sortValues: true,
      numberedList: false
    },
    {
      id: 'language',
      valueType: 'string',
      makeLink: false,
      sortValues: true,
      numberedList: false
    },
    // {
    //   id: 'material',
    //   valueType: 'string',
    //   makeLink: true,
    //   sortValues: true
    //   numberedList: false
    // },
    {
      id: 'event',
      valueType: 'event',
      makeLink: true,
      sortValues: true,
      numberedList: false,
      minWidth: 170,
    },
    {
      id: 'owner',
      valueType: 'owner',
      makeLink: true,
      sortValues: true,
      numberedList: true,
      minWidth: 170
    }
  ],
};

const manuscripts = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'manuscripts') {
    switch (action.type) {
      case FETCH_PAGINATED_RESULTS:
        return { ...state, fetching: true };
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
          fetchingPlaces: false
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

export default manuscripts;
