import {
  UPDATE_RESULTS,
  CLEAR_RESULTS,
} from '../actions';

const results = (state = [], action) => {
  switch (action.type) {
    case UPDATE_RESULTS:
      return action.results;
    case CLEAR_RESULTS:
      return [];
    default:
      return state;
  }
};

export default results;
