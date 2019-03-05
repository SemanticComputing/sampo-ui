import {
  SHOW_ERROR,
  FETCH_RESULTS_FAILED,
  FETCH_PAGINATED_RESULTS_FAILED,
  FETCH_FACET_FAILED,
  FETCH_BY_URI_FAILED,
} from '../actions';

export const INITIAL_STATE = {
  id: 0,
  message: {},
};

const error = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_ERROR:
    case FETCH_RESULTS_FAILED:
    case FETCH_PAGINATED_RESULTS_FAILED:
    case FETCH_BY_URI_FAILED:
    case FETCH_FACET_FAILED:
      return {
        ...state,
        id: state.id + 1,
        message: {
          text: action.message.text,
          title: action.message.title
        }
      };
    default:
      return state;
  }
};

export default error;
