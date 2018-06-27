import {
  UPDATE_LANGUAGE,
  UPDATE_RESULT_FORMAT,
  OPEN_DRAWER,
  CLOSE_DRAWER,
  SET_MAP_READY
} from '../actions';

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_DRAWER_IS_OPEN = false;
const DEFAULT_RESULT_FORMAT = 'table';

export const INITIAL_STATE = {
  language: DEFAULT_LANGUAGE,
  resultFormat: DEFAULT_RESULT_FORMAT,
  drawerIsOpen: DEFAULT_DRAWER_IS_OPEN,
  mapReady: false
};

const options = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, language: action.language || DEFAULT_LANGUAGE };
    case UPDATE_RESULT_FORMAT:
      return { ...state, resultFormat: action.resultFormat || DEFAULT_RESULT_FORMAT };
    case OPEN_DRAWER:
      return { ...state, drawerIsOpen: true };
    case CLOSE_DRAWER:
      return { ...state, drawerIsOpen: false };
    case SET_MAP_READY:
      return { ...state, mapReady: true };
    default:
      return state;
  }
};

export default options;
