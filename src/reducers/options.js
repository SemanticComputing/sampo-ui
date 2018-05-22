import {
  UPDATE_LANGUAGE,
  OPEN_DRAWER,
  CLOSE_DRAWER
} from '../actions';

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_DRAWER_IS_OPEN = true;

export const INITIAL_STATE = {
  language: DEFAULT_LANGUAGE,
  drawerIsOpen: DEFAULT_DRAWER_IS_OPEN
};

const options = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, language: action.language || DEFAULT_LANGUAGE };
    case OPEN_DRAWER:
      return { ...state, drawerIsOpen: true };
    case CLOSE_DRAWER:
      return { ...state, drawerIsOpen: false };
    default:
      return state;
  }
};

export default options;
