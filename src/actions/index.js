export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const UPDATE_QUERY = 'UPDATE_QUERY';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const START_SPINNER = 'START_SPINNER';
export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const FETCH_SUGGESTIONS_FAILED = 'FETCH_SUGGESTIONS_FAILED';
export const UPDATE_SUGGESTIONS = 'UPDATE_SUGGESTIONS';
export const CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS';
export const FETCH_RESULTS = 'FETCH_RESULTS';
export const FETCH_RESULTS_FAILED = 'FETCH_RESULTS_FAILED';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';

export const openDrawer = () => ({
  type: OPEN_DRAWER,
});

export const closeDrawer = () => ({
  type: CLOSE_DRAWER,
});

export const updateQuery = (query) => ({
  type: UPDATE_QUERY,
  query
});

export const updateDatasets = (datasets) => ({
  type: UPDATE_DATASETS,
  datasets
});

export const startSpinner = () => ({
  type: START_SPINNER,
});

export const fetchSuggestions = () => ({
  type: FETCH_SUGGESTIONS,
});

export const fetchSuggestionsFailed = (error) => ({
  type: FETCH_SUGGESTIONS_FAILED,
  error
});

export const fetchResultsFailed = (error) => ({
  type: FETCH_RESULTS_FAILED,
  error
});

export const updateSuggestions = ({ suggestions }) => ({
  type: UPDATE_SUGGESTIONS,
  suggestions
});

export const clearSuggestions = () => ({
  type: CLEAR_SUGGESTIONS,
});

export const fetchResults = () => ({
  type: FETCH_RESULTS,
});

export const updateResults = (results) => ({
  type: UPDATE_RESULTS,
  results
});

export const clearResults = () => ({
  type: CLEAR_RESULTS,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

export const updateLanguage = (language) => ({
  type: UPDATE_LANGUAGE,
  language
});
