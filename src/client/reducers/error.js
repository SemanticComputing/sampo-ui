import {
  //FETCH_SUGGESTIONS_FAILED,
  CLEAR_ERROR,
  //FETCH_SUGGESTIONS,
} from '../actions';

export const INITIAL_STATE = {
  hasError: false,
  message: {},
};

const error = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case FETCH_SUGGESTIONS_FAILED:
    //   return {
    //     ...state,
    //     hasError: true,
    //     message: {
    //       text: action.error.xhr.statusText,
    //       title: 'Error',
    //     },
    //   };
    // case FETCH_SUGGESTIONS:
    case CLEAR_ERROR:
      return {
        ...state,
        hasError: false,
        message: {},
      };
    default:
      return state;
  }
};

export default error;
