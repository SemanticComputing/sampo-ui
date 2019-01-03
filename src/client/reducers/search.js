import {
  FETCH_MANUSCRIPTS,
  FETCH_PLACES,
  FETCH_PLACE,
  UPDATE_MANUSCRIPTS,
  UPDATE_PLACES,
  UPDATE_PLACE,
  UPDATE_PAGE,
  SORT_RESULTS,
} from '../actions';

export const INITIAL_STATE = {
  manuscriptCount: 0,
  manuscripts: [],
  places: [],
  place: {},
  page: -1,
  pagesize: 5,
  sortBy: 'productionPlace',
  sortDirection: 'asc',
  fetchingPlaces: false,
  fetchingManuscripts: false
};

const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_MANUSCRIPTS:
      return { ...state, fetchingManuscripts: true };
    case FETCH_PLACES:
      return { ...state, fetchingPlaces: true };
    case FETCH_PLACE:
      return { ...state, fetchingPlaces: true };
    case SORT_RESULTS:
      return updateSortBy(state, action);
    case UPDATE_MANUSCRIPTS:
      // console.log('updating manuscripts in reducer:');
      // console.log(action);
      return {
        ...state,
        manuscriptCount: parseInt(action.data.manuscriptCount),
        manuscripts: action.data.manuscriptData,
        fetchingManuscripts: false
      };
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case UPDATE_PLACES:
      return {
        ...state,
        places: action.places,
        fetchingPlaces: false
      };
    case UPDATE_PLACE:
      return {
        ...state,
        place: action.place,
        fetchingPlaces: false
      };
    default:
      return state;
  }
};

const updateSortBy = (state, action) => {
  if (state.sortBy === action.sortBy) {
    return {
      ...state,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc'
    };
  } else {
    return {
      ...state,
      sortBy: action.sortBy,
      sortDirection: 'asc'
    };
  }
};

export default search;
