import { UPDATE_LANGUAGE } from '../actions';

const DEFAULT_LANGUAGE = 'en';

export const INITIAL_STATE = {
  language: DEFAULT_LANGUAGE
};

const options = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, language: action.language || DEFAULT_LANGUAGE };
    default:
      return state;
  }
};

export default options;
