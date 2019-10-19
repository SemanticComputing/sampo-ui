import {
  UPDATE_LOCALE
} from '../actions';

export const INITIAL_STATE = {
  locale: 'en',
};

const options = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LOCALE:
      return {
        ...state,
        locale: action.language
      };
    default:
      return state;
  }
};

export default options;
