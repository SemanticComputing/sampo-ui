import {
  UPDATE_LANGUAGE,
  UPDATE_RESULT_FORMAT,
  UPDATE_MAP_MODE,
} from '../actions';

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_RESULT_FORMAT = 'table';
const DEFAULT_MAP_MODE = 'marker';

export const INITIAL_STATE = {
  language: DEFAULT_LANGUAGE,
  resultFormat: DEFAULT_RESULT_FORMAT,
  mapMode: DEFAULT_MAP_MODE
};

const options = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, language: action.language || DEFAULT_LANGUAGE };
    case UPDATE_RESULT_FORMAT:
      return { ...state, resultFormat: action.resultFormat || DEFAULT_RESULT_FORMAT };
    case UPDATE_MAP_MODE:
      return { ...state, mapMode: action.mapMode || DEFAULT_MAP_MODE };
    default:
      return state;
  }
};

export default options;
