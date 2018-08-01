import {
  UPDATE_LANGUAGE,
  UPDATE_RESULT_FORMAT,
  OPEN_ANALYSIS_VIEW,
  CLOSE_ANALYSIS_VIEW,
} from '../actions';

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_ANALYSIS_VIEW = false;
const DEFAULT_RESULT_FORMAT = 'table';

export const INITIAL_STATE = {
  language: DEFAULT_LANGUAGE,
  resultFormat: DEFAULT_RESULT_FORMAT,
  analysisView: DEFAULT_ANALYSIS_VIEW,
};

const options = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return { ...state, language: action.language || DEFAULT_LANGUAGE };
    case UPDATE_RESULT_FORMAT:
      return { ...state, resultFormat: action.resultFormat || DEFAULT_RESULT_FORMAT };
    case OPEN_ANALYSIS_VIEW:
      return { ...state, analysisView: true };
    case CLOSE_ANALYSIS_VIEW:
      return { ...state, analysisView: false };
    default:
      return state;
  }
};

export default options;
